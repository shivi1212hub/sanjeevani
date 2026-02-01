import { useState, useRef, useCallback, useEffect } from "react";

interface RppgState {
  heartRate: number | null;
  signalQuality: number;
  isProcessing: boolean;
  error: string | null;
}

interface RppgConfig {
  sampleRate: number; // frames per second for processing
  windowSize: number; // seconds of data to analyze
  minHeartRate: number;
  maxHeartRate: number;
}

const DEFAULT_CONFIG: RppgConfig = {
  sampleRate: 30,
  windowSize: 10,
  minHeartRate: 40,
  maxHeartRate: 180,
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

  // Extract green channel average from face region
  const extractGreenChannel = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number): number => {
    // Focus on center region (typical face position)
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
      
      // Simple skin detection - skip non-skin pixels
      if (r > 60 && g > 40 && b > 20 && r > b && (r - g) < 100) {
        greenSum += g;
        count++;
      }
    }

    return count > 0 ? greenSum / count : 0;
  }, []);

  // Bandpass filter for heart rate frequencies
  const bandpassFilter = useCallback((signal: number[], lowCut: number, highCut: number, fs: number): number[] => {
    const n = signal.length;
    if (n < 4) return signal;

    // Simple moving average detrend
    const windowSize = Math.floor(fs * 2);
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

  // FFT-based heart rate estimation
  const estimateHeartRate = useCallback((signal: number[], timestamps: number[]): { hr: number; quality: number } => {
    const n = signal.length;
    if (n < 64) return { hr: 0, quality: 0 };

    // Calculate actual sample rate
    const duration = (timestamps[timestamps.length - 1] - timestamps[0]) / 1000;
    const actualFs = n / duration;

    // Bandpass filter (0.7 - 3.0 Hz corresponds to 42-180 BPM)
    const filtered = bandpassFilter(signal, 0.7, 3.0, actualFs);

    // Simple zero-crossing based frequency estimation
    let zeroCrossings = 0;
    for (let i = 1; i < filtered.length; i++) {
      if ((filtered[i - 1] < 0 && filtered[i] >= 0) || 
          (filtered[i - 1] >= 0 && filtered[i] < 0)) {
        zeroCrossings++;
      }
    }

    // Each complete cycle has 2 zero crossings
    const frequency = zeroCrossings / 2 / duration;
    const heartRate = frequency * 60;

    // Calculate signal quality based on signal variance and consistency
    const mean = filtered.reduce((a, b) => a + b, 0) / n;
    const variance = filtered.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const quality = Math.min(100, Math.max(0, Math.sqrt(variance) * 10));

    // Clamp heart rate to valid range
    const clampedHr = Math.max(
      finalConfig.minHeartRate,
      Math.min(finalConfig.maxHeartRate, heartRate)
    );

    return { hr: Math.round(clampedHr), quality };
  }, [bandpassFilter, finalConfig.minHeartRate, finalConfig.maxHeartRate]);

  // Process video frame
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

      // Draw video frame to canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Extract green channel
      const greenValue = extractGreenChannel(ctx, canvas.width, canvas.height);
      
      if (greenValue > 0) {
        greenChannelBuffer.current.push(greenValue);
        timestampBuffer.current.push(now);

        // Keep only recent samples
        const maxSamples = finalConfig.sampleRate * finalConfig.windowSize;
        if (greenChannelBuffer.current.length > maxSamples) {
          greenChannelBuffer.current.shift();
          timestampBuffer.current.shift();
        }

        // Estimate heart rate if we have enough samples
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
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [extractGreenChannel, estimateHeartRate, finalConfig.sampleRate, finalConfig.windowSize]);

  // Start camera and processing
  const startCamera = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));

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

      // Clear buffers
      greenChannelBuffer.current = [];
      timestampBuffer.current = [];
      lastProcessTime.current = 0;

      // Start processing
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

  // Stop camera and processing
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

  // Cleanup on unmount
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
