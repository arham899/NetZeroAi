import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

interface Step {
  id: string;
  label: string;
}

interface StepSelectorProps {
  steps: Step[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
}

export default function StepSelector({
  steps,
  currentStepIndex,
  onStepChange,
}: StepSelectorProps) {
  return (
    <div className="mb-16">
      {/* Step Indicator Circles */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step Circle Button */}
              <motion.button
                onClick={() => onStepChange(index)}
                disabled={isUpcoming}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm mb-3 transition-all ${isCurrent
                    ? "bg-emerald-600 text-white ring-2 ring-emerald-300 ring-offset-2"
                    : isCompleted
                      ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                whileHover={isCompleted ? { scale: 1.1 } : {}}
                whileTap={isCompleted ? { scale: 0.95 } : {}}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  index + 1
                )}
              </motion.button>

              {/* Step Label */}
              <span
                className={`text-xs text-center font-medium transition-colors ${isCurrent
                    ? "text-emerald-600"
                    : isCompleted
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Connecting Line */}
      <div className="mt-8 relative h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
          initial={{ width: 0 }}
          animate={{
            width: `${currentStepIndex === 0
                ? 0
                : ((currentStepIndex) / (steps.length - 1)) * 100
              }%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

