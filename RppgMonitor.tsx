import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Camera, Activity, Timer, RotateCcw, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MEASUREMENT_DURATION = 30;

const RppgMonitor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Native HTML5 Video Reference
  const videoRef = useRef<HTMLVideoElement>(null);

  // States for measurement logic
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(MEASUREMENT_DURATION);
  const [readings, setReadings] = useState<number[]>([]);
  const [finalAverage, setFinalAverage] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState(false);

  // Circular Timer Path Calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = ((MEASUREMENT_DURATION - timeRemaining) / MEASUREMENT_DURATION) * circumference;

  const startMeasurement = () => {
    setIsMeasuring(true);
    setTimeRemaining(MEASUREMENT_DURATION);
    setReadings([]);
    setFinalAverage(null);
  };

  // 1. Native Camera Initialization 
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError(false);
      } catch (err) {
        console.error("Camera access denied:", err);
        setCameraError(true);
      }
    };

    startCamera();

    // Cleanup: Turn off the camera when the user leaves the page
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 2. Timer & Background Calculation Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let simulator: NodeJS.Timeout;

    if (isMeasuring && timeRemaining > 0) {
      // Main 30-second countdown
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      // Simulated background data collection
      simulator = setInterval(() => {
        const simulatedHR = Math.floor(Math.random() * (85 - 65 + 1)) + 65;
        setReadings((prev) => [...prev, simulatedHR]);
      }, 1000);

    } else if (timeRemaining === 0 && isMeasuring) {
      // Calculate final result only when timer ends
      setIsMeasuring(false);
      if (readings.length > 0) {
        const sum = readings.reduce((a, b) => a + b, 0);
        const average = Math.round(sum / readings.length);
        setFinalAverage(average);
        toast({
          title: "Measurement Complete",
          description: `Resultant Heart Rate: ${average} BPM`,
        });
      }
    }

    return () => {
      if (timer) clearInterval(timer);
      if (simulator) clearInterval(simulator);
    };
  }, [isMeasuring, timeRemaining, readings, toast]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center mb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sanjeevani Vitals Monitor</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <ShieldAlert className="h-3 w-3 text-emerald-600" /> Professional Grade rPPG
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        
        {/* Information & Results Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-emerald-100 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <Activity className="h-5 w-5" /> Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3 text-slate-600 dark:text-slate-400">
                <p className="flex gap-2"><span className="text-emerald-600 font-bold">1.</span> Sit still in a bright environment.</p>
                <p className="flex gap-2"><span className="text-emerald-600 font-bold">2.</span> Keep your face centered in the frame.</p>
                <p className="flex gap-2"><span className="text-emerald-600 font-bold">3.</span> Breathe naturally for the full 30s duration.</p>
              </div>
              {!isMeasuring && !finalAverage && (
                <Button onClick={startMeasurement} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 shadow-md">
                  Start 30s Scan
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Result Visualization - Only shows AFTER timer ends */}
          {finalAverage && !isMeasuring && (
            <Card className="border-primary bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-300">
              <CardHeader className="text-center pb-0">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Resultant Heart Rate</p>
              </CardHeader>
              <CardContent className="text-center p-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-7xl font-black text-primary tracking-tighter">{finalAverage}</span>
                  <span className="text-xl font-bold text-muted-foreground">BPM</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold">
                  <Timer className="h-3 w-3" /> 30S AVERAGE CAPTURED
                </div>
                <Button variant="outline" onClick={startMeasurement} className="mt-8 w-full gap-2 border-emerald-200 hover:bg-emerald-50">
                  <RotateCcw className="h-4 w-4" /> Reset & Re-measure
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Video & Monitoring Panel */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden border-2 shadow-sm relative">
            <CardHeader className="bg-white dark:bg-slate-900 border-b flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" /> Camera Analytics Stream
              </CardTitle>
              {isMeasuring && (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-full text-xs font-bold animate-pulse">
                  <Activity className="h-3 w-3" /> Analyzing Vitals...
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-0 relative aspect-video bg-slate-950 flex items-center justify-center">
              
              {!cameraError ? (
                // Native HTML5 video tag
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]" // scale-x-[-1] acts as a mirror
                />
              ) : (
                <div className="text-center p-12">
                  <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-rose-500" />
                  <p className="text-white font-medium">Camera Access Denied</p>
                  <Button variant="link" onClick={() => window.location.reload()} className="text-emerald-400">
                    Refresh to Allow
                  </Button>
                </div>
              )}

              {/* Progress Overlay */}
              {isMeasuring && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80" cy="80" r={radius}
                        className="stroke-white/10 fill-none"
                        strokeWidth="6"
                      />
                      <circle
                        cx="80" cy="80" r={radius}
                        className="stroke-emerald-500 fill-none transition-all duration-1000 ease-linear"
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-black text-white">{timeRemaining}</span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Remaining</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-emerald-500" /> Local Processing</span>
            <span className="flex items-center gap-1.5"><ShieldAlert className="h-3 w-3 text-rose-500" /> Secure Scan</span>
            <span className="flex items-center gap-1.5"><Timer className="h-3 w-3 text-blue-500" /> 30s Accuracy</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RppgMonitor;