import { useState, useRef, useCallback, useEffect } from "react";

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
    heartRate: null, signalQuality: 0, isProcessing: false, error: null,
  });

  // Timer / measurement state
  const [isTiming, setIsTiming] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const avgHeartRate = useRef<number | null>(null);
  const samplesRef = useRef<number[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const greenChannelBuffer = useRef<number[]>([]);
  const timestampBuffer = useRef<number[]>([]);
  const lastProcessTime = useRef<number>(0);

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
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r > 60 && g > 40 && b > 20 && r > b && (r - g) < 100) {
        greenSum += g; count++;
      }
    }
    return count > 0 ? greenSum / count : 0;
  }, []);

  const bandpassFilter = useCallback((signal: number[], lowCut: number, highCut: number, fs: number): number[] => {
    const n = signal.length;
    if (n < 4) return signal;
    const windowSize = Math.floor(fs * 2);
    const detrended: number[] = [];
    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - windowSize);
      const end = Math.min(n, i + windowSize);
      let sum = 0;
      for (let j = start; j < end; j++) sum += signal[j];
      detrended.push(signal[i] - sum / (end - start));
    }
    return detrended;
  }, []);

  const estimateHeartRate = useCallback((signal: number[], timestamps: number[]): { hr: number; quality: number } => {
    const n = signal.length;
    if (n < 64) return { hr: 0, quality: 0 };
    const duration = (timestamps[timestamps.length - 1] - timestamps[0]) / 1000;
    const actualFs = n / duration;
    const filtered = bandpassFilter(signal, 0.7, 3.0, actualFs);
    let zeroCrossings = 0;
    for (let i = 1; i < filtered.length; i++) {
      if ((filtered[i - 1] < 0 && filtered[i] >= 0) || (filtered[i - 1] >= 0 && filtered[i] < 0)) zeroCrossings++;
    }
    const frequency = zeroCrossings / 2 / duration;
    const heartRate = frequency * 60;
    const mean = filtered.reduce((a, b) => a + b, 0) / n;
    const variance = filtered.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const quality = Math.min(100, Math.max(0, Math.sqrt(variance) * 10));
    const clampedHr = Math.max(finalConfig.minHeartRate, Math.min(finalConfig.maxHeartRate, heartRate));
    return { hr: Math.round(clampedHr), quality };
  }, [bandpassFilter, finalConfig.minHeartRate, finalConfig.maxHeartRate]);

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) { animationFrameRef.current = requestAnimationFrame(processFrame); return; }
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
              const { hr, quality } = estimateHeartRate(greenChannelBuffer.current, timestampBuffer.current);
              setState(prev => ({ ...prev, heartRate: hr, signalQuality: quality }));
              // collect sample for averaging if timing
              if (isTiming) {
                if (hr && hr > 0) samplesRef.current.push(hr);
              }
            }
      }
    }
    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [extractGreenChannel, estimateHeartRate, finalConfig.sampleRate, finalConfig.windowSize]);

  const startCamera = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
      });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      greenChannelBuffer.current = [];
      timestampBuffer.current = [];
      lastProcessTime.current = 0;
      animationFrameRef.current = requestAnimationFrame(processFrame);
    } catch (err) {
      setState(prev => ({ ...prev, isProcessing: false, error: err instanceof Error ? err.message : "Failed to access camera" }));
    }
  }, [processFrame]);

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) { cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    greenChannelBuffer.current = [];
    timestampBuffer.current = [];
    setState({ heartRate: null, signalQuality: 0, isProcessing: false, error: null });
  }, []);

  // Start a timed measurement: takes durationSeconds, starts camera if needed,
  // collects samples and computes avg at end (stored in avgHeartRate.current)
  const startMeasurement = useCallback(async (durationSeconds: number = 30) => {
    try {
      // ensure camera started
      await startCamera();
      samplesRef.current = [];
      avgHeartRate.current = null;
      setTimeLeft(durationSeconds);
      setIsTiming(true);
      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            // finish
            if (timerIntervalRef.current) { clearInterval(timerIntervalRef.current); timerIntervalRef.current = null; }
            setIsTiming(false);
            // compute avg
            if (samplesRef.current.length > 0) {
              const sum = samplesRef.current.reduce((a, b) => a + b, 0);
              avgHeartRate.current = Math.round(sum / samplesRef.current.length);
            } else {
              avgHeartRate.current = null;
            }
            // stop camera after measurement
            stopCamera();
            return 0;
          }
          return t - 1;
        });
      }, 1000) as unknown as number;
    } catch (err) {
      setState(prev => ({ ...prev, isProcessing: false, error: err instanceof Error ? err.message : String(err) }));
    }
  }, [startCamera, stopCamera]);

  const stopMeasurement = useCallback(() => {
    if (timerIntervalRef.current) { clearInterval(timerIntervalRef.current); timerIntervalRef.current = null; }
    setIsTiming(false);
    setTimeLeft(0);
    // compute avg if samples exist
    if (samplesRef.current.length > 0) {
      const sum = samplesRef.current.reduce((a, b) => a + b, 0);
      avgHeartRate.current = Math.round(sum / samplesRef.current.length);
    } else {
      avgHeartRate.current = null;
    }
    stopCamera();
  }, [stopCamera]);

  useEffect(() => { return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); stopCamera(); }; }, [stopCamera]);

  return { ...state, videoRef, canvasRef, startCamera, stopCamera, startMeasurement, stopMeasurement, isTiming, timeLeft, getAvg: () => avgHeartRate.current };
}
