import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ArrowRight, AlertTriangle } from "lucide-react";

interface SlideToConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const SlideToConfirm = ({ onConfirm, onCancel }: SlideToConfirmProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [sliderWidth, setSliderWidth] = useState(280);

  const background = useTransform(
    x,
    [0, sliderWidth - 64],
    ["hsl(var(--destructive))", "hsl(var(--success))"]
  );

  const opacity = useTransform(x, [0, sliderWidth - 64], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = sliderWidth - 80;
    if (info.point.x > threshold || x.get() > threshold - 20) {
      setIsCompleted(true);
      setTimeout(() => {
        onConfirm();
      }, 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-destructive animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Confirm Emergency
          </h3>
          <p className="text-muted-foreground">
            Slide to confirm and alert nearby Health Warriors
          </p>
        </div>

        {/* Slide to Confirm */}
        <div
          ref={constraintsRef}
          className="relative h-16 bg-destructive/20 rounded-full overflow-hidden mb-6"
          style={{ width: "100%" }}
          onLoad={() => {
            if (constraintsRef.current) {
              setSliderWidth(constraintsRef.current.offsetWidth);
            }
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background }}
          />
          
          {/* Text hint */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity }}
          >
            <span className="text-destructive-foreground font-semibold flex items-center gap-2">
              Slide to confirm
              <ArrowRight className="h-5 w-5 animate-pulse" />
            </span>
          </motion.div>

          {/* Draggable button */}
          <motion.div
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className={`absolute top-1 left-1 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing ${
              isCompleted ? "bg-success" : ""
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-success"
              >
                ✓
              </motion.div>
            ) : (
              <ArrowRight className="h-6 w-6 text-destructive" />
            )}
          </motion.div>
        </div>

        <button
          onClick={onCancel}
          className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default SlideToConfirm;
