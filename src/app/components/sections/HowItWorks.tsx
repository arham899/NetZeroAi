import { motion } from "motion/react";
import { ClipboardList, LineChart, Target, Sparkles } from "lucide-react";
import { useInView } from "../../hooks/useInView";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Enter Your Data",
    description: "Provide information about your daily activities, transportation habits, energy consumption, and lifestyle choices through our intuitive interface.",
  },
  {
    icon: LineChart,
    step: "02",
    title: "Analyze Results",
    description: "Receive a comprehensive breakdown of your carbon emissions with clear visualizations showing where your impact is greatest.",
  },
  {
    icon: Target,
    step: "03",
    title: "Set Objectives",
    description: "Create personalized reduction targets based on your current footprint and sustainability goals with realistic timelines.",
  },
  {
    icon: Sparkles,
    step: "04",
    title: "Take Action",
    description: "Implement tailored recommendations and track your progress as you work toward a more sustainable lifestyle.",
  },
];

export function HowItWorks() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-2 mb-6">
            <span className="text-emerald-400 text-sm font-medium">Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Four Simple Steps to
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Sustainability
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Getting started is straightforward. Follow these steps to begin your journey toward a reduced carbon footprint.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative mb-12 last:mb-0"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Step number and icon */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 relative"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 border-2 border-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-emerald-400 font-bold text-sm">{step.step}</span>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-12 top-28 w-0.5 h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}