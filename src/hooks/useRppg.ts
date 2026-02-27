import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RppgState {
  heartRate: number | null;
  signalQuality: number;
  isProcessing: boolean;
  error: string | null;
}

interface RppgConfig {
  sampleRate: number;
  windowSize: number;
  minHeartRate: number;
  maxHeartRate: number;
  saveToBackend: boolean;
}

const DEFAULT_CONFIG: RppgConfig = {
  sampleRate: 30,
  windowSize: 10,
  minHeartRate: 40,
  maxHeartRate: 180,
  saveToBackend: true,
};

export function useRppg(config: Partial<RppgConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [state, setState] = useState<RppgState>({
    heartRate: null,
    signalQuality: 0,
    isProcessing: false,
    error: null,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const greenChannelBuffer = useRef<number[]>([]);
  const timestampBuffer = useRef<number[]>([]);
  const lastProcessTime = useRef<number>(0);
  const sessionId = useRef<string>(crypto.randomUUID());
  const lastSaveTime = useRef<number>(0);

  const extractGreenChannel = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number): number => {
    const roiX = Math.floor(width * 0.3);
    const roiY = Math.floor(height * 0.2);
    const roiWidth = Math.floor(width * 0.4);
    const roiHeight = Math.floor(height * 0.4);

    const imageData = ctx.getImageData(roiX, roiY, roiWidth, roiHeight);
    const data = imageData.data;

    let greenSum = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > 60 && g > 40 && b > 20 && r > b && (r - g) < 100) {
        greenSum += g;
        count++;
      }
    }

    return count > 0 ? greenSum / count : 0;
  }, []);

  const bandpassFilter = useCallback((signal: number[], _lowCut: number, _highCut: number, _fs: number): number[] => {
    const n = signal.length;
    if (n < 4) return signal;

    const windowSize = Math.floor(_fs * 2);
    const detrended: number[] = [];

    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - windowSize);
      const end = Math.min(n, i + windowSize);
      let sum = 0;
      for (let j = start; j < end; j++) {
        sum += signal[j];
      }
      detrended.push(signal[i] - sum / (end - start));
    }

    return detrended;
  }, []);

  // Save vitals to backend
  const saveVitals = useCallback(async (hr: number, quality: number) => {
    if (!finalConfig.saveToBackend) return;
    const now = Date.now();
    // Save at most every 5 seconds
    if (now - lastSaveTime.current < 5000) return;
    lastSaveTime.current = now;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("vitals_stream").insert({
        user_id: user.id,
        heart_rate: hr,
        signal_quality: quality,
        session_id: sessionId.current,
      });
    } catch (err) {
      console.error("Failed to save vitals:", err);
    }
  }, [finalConfig.saveToBackend]);

  const estimateHeartRate = useCallback((signal: number[], timestamps: number[]): { hr: number; quality: number } => {
    const n = signal.length;
    if (n < 64) return { hr: 0, quality: 0 };

    const duration = (timestamps[timestamps.length - 1] - timestamps[0]) / 1000;
    const actualFs = n / duration;

    const filtered = bandpassFilter(signal, 0.7, 3.0, actualFs);

    // Use autocorrelation for better accuracy
    const maxLag = Math.floor(actualFs / (finalConfig.minHeartRate / 60));
    const minLag = Math.floor(actualFs / (finalConfig.maxHeartRate / 60));

    let bestLag = minLag;
    let bestCorr = -Infinity;

    for (let lag = minLag; lag <= Math.min(maxLag, filtered.length - 1); lag++) {
      let corr = 0;
      let count = 0;
      for (let i = 0; i < filtered.length - lag; i++) {
        corr += filtered[i] * filtered[i + lag];
        count++;
      }
      corr /= count;
      if (corr > bestCorr) {
        bestCorr = corr;
        bestLag = lag;
      }
    }

    const frequency = actualFs / bestLag;
    const heartRate = frequency * 60;

    // Calculate quality
    const mean = filtered.reduce((a, b) => a + b, 0) / n;
    const variance = filtered.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const quality = Math.min(100, Math.max(0, Math.sqrt(variance) * 15));

    const clampedHr = Math.max(
      finalConfig.minHeartRate,
      Math.min(finalConfig.maxHeartRate, heartRate)
    );

    return { hr: Math.round(clampedHr), quality: Math.round(quality) };
  }, [bandpassFilter, finalConfig.minHeartRate, finalConfig.maxHeartRate]);

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const now = performance.now();
    const frameInterval = 1000 / finalConfig.sampleRate;

    if (now - lastProcessTime.current >= frameInterval) {
      lastProcessTime.current = now;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const greenValue = extractGreenChannel(ctx, canvas.width, canvas.height);

      if (greenValue > 0) {
        greenChannelBuffer.current.push(greenValue);
        timestampBuffer.current.push(now);

        const maxSamples = finalConfig.sampleRate * finalConfig.windowSize;
        if (greenChannelBuffer.current.length > maxSamples) {
          greenChannelBuffer.current.shift();
          timestampBuffer.current.shift();
        }

        if (greenChannelBuffer.current.length >= finalConfig.sampleRate * 3) {
          const { hr, quality } = estimateHeartRate(
            greenChannelBuffer.current,
            timestampBuffer.current
          );

          setState(prev => ({
            ...prev,
            heartRate: hr,
            signalQuality: quality,
          }));

          // Auto-save to backend when quality is decent
          if (hr > 0 && quality >= 30) {
            saveVitals(hr, quality);
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [extractGreenChannel, estimateHeartRate, saveVitals, finalConfig.sampleRate, finalConfig.windowSize]);

  const startCamera = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      sessionId.current = crypto.randomUUID();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      greenChannelBuffer.current = [];
      timestampBuffer.current = [];
      lastProcessTime.current = 0;
      lastSaveTime.current = 0;

      animationFrameRef.current = requestAnimationFrame(processFrame);
    } catch (err) {
      console.error("Camera error:", err);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: err instanceof Error ? err.message : "Failed to access camera",
      }));
    }
  }, [processFrame]);

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    greenChannelBuffer.current = [];
    timestampBuffer.current = [];

    setState({
      heartRate: null,
      signalQuality: 0,
      isProcessing: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    ...state,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
  };
}
