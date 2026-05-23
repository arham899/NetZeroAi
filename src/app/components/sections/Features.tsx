import { motion } from "motion/react";
import { Calculator, TrendingDown, Award, BarChart3, Globe, Zap } from "lucide-react";
import { useInView } from "../../hooks/useInView";

const features = [
  {
    icon: Calculator,
    title: "Precision Analytics",
    description: "Advanced algorithms analyze your lifestyle data to provide accurate carbon footprint measurements across all categories.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: TrendingDown,
    title: "Progress Tracking",
    description: "Monitor your emission reduction journey with interactive charts and milestone tracking over time.",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    icon: Award,
    title: "Goal Achievement",
    description: "Set personalized sustainability targets and earn recognition for reaching your environmental milestones.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: BarChart3,
    title: "Comprehensive Reports",
    description: "Access detailed breakdowns of your emissions by category with actionable insights for improvement.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Globe,
    title: "Global Benchmarking",
    description: "Compare your footprint against regional and global averages to understand your relative impact.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: Zap,
    title: "Smart Recommendations",
    description: "Receive AI-powered suggestions tailored to your lifestyle for maximum emission reduction.",
    gradient: "from-purple-500 to-pink-600",
  },
];

export function Features() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-2 mb-6">
            <span className="text-emerald-400 text-sm font-medium">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need for
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Carbon Neutrality
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A complete platform designed to help you understand, track, and reduce your environmental footprint effectively.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover accent line */}
                <div className="mt-6 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}