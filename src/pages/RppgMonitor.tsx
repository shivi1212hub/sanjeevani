import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Camera, CameraOff, Activity, AlertCircle, Info, ChevronLeft, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRppg } from "@/hooks/useRppg";
import { useLanguage } from "@/contexts/LanguageContext";

const RppgMonitor = () => {
  const { heartRate, signalQuality, isProcessing, error, videoRef, canvasRef, startCamera, stopCamera } = useRppg();
  const { t } = useLanguage();
  const [showTips, setShowTips] = useState(true);

  const tips = [t("rppg.tip1"), t("rppg.tip2"), t("rppg.tip3"), t("rppg.tip4"), t("rppg.tip5")];

  const getQualityColor = (quality: number) => {
    if (quality >= 70) return "text-success";
    if (quality >= 40) return "text-warning";
    return "text-destructive";
  };

  const getQualityLabel = (quality: number) => {
    if (quality >= 70) return t("rppg.good");
    if (quality >= 40) return t("rppg.fair");
    return t("rppg.poor");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md shadow-soft border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">{t("rppg.back")}</span>
          </Link>
          <h1 className="font-semibold text-foreground">{t("rppg.title")}</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence>
          {showTips && !isProcessing && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">{t("rppg.howItWorks")}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{t("rppg.howItWorksDesc")}</p>
                    <Button variant="ghost" size="sm" onClick={() => setShowTips(false)} className="text-primary">{t("rppg.gotIt")}</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="overflow-hidden mb-6">
          <div className="relative aspect-[4/3] bg-muted">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            {!isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80">
                <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center px-4">{t("rppg.clickToStart")}</p>
              </div>
            )}
            {isProcessing && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <ellipse cx="50" cy="40" rx="20" ry="25" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex justify-center">
              {!isProcessing ? (
                <Button onClick={startCamera} size="lg" className="gap-2">
                  <Camera className="h-5 w-5" />
                  {t("rppg.startMeasurement")}
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="outline" size="lg" className="gap-2">
                  <CameraOff className="h-5 w-5" />
                  {t("rppg.stop")}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {error && (
          <Card className="p-4 mb-6 bg-destructive/10 border-destructive/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </div>
          </Card>
        )}

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold text-foreground">{t("rppg.heartRate")}</h3>
              </div>
              {isProcessing && (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: heartRate ? 60 / heartRate : 1 }}>
                  <Heart className="h-6 w-6 text-destructive fill-destructive" />
                </motion.div>
              )}
            </div>
            <div className="text-center py-6">
              {heartRate !== null ? (
                <motion.div key={heartRate} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold text-foreground">{heartRate}</span>
                  <span className="text-xl text-muted-foreground">BPM</span>
                </motion.div>
              ) : (
                <div className="text-4xl text-muted-foreground">--</div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("rppg.signalQuality")}</span>
                </div>
                <span className={getQualityColor(signalQuality)}>{getQualityLabel(signalQuality)}</span>
              </div>
              <Progress value={signalQuality} className="h-2" />
            </div>
          </Card>
        </motion.div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-warning" />
            <h3 className="font-semibold text-foreground">{t("rppg.tips")}</h3>
          </div>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6 px-4">{t("rppg.disclaimer")}</p>
      </main>
    </div>
  );
};

export default RppgMonitor;
