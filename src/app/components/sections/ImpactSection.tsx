import { motion } from "motion/react";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { useInView } from "../../hooks/useInView";
import { Leaf, Wind, Droplet, Sun } from "lucide-react";

const impacts = [
  {
    icon: Leaf,
    value: "45%",
    label: "Average Reduction",
    description: "Users reduce emissions within 6 months",
  },
  {
    icon: Wind,
    value: "100K",
    label: "Trees Equivalent",
    description: "CO2 offset equals trees planted",
  },
  {
    icon: Droplet,
    value: "2.8M",
    label: "Liters Conserved",
    description: "Water saved through lifestyle changes",
  },
  {
    icon: Sun,
    value: "15K",
    label: "Clean Energy",
    description: "Equivalent solar panel impact",
  },
];

export function ImpactSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1656740840031-41cb3bc73c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVhcnRoJTIwbmF0dXJlfGVufDF8fHx8MTc2NTg3OTgzNHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Sustainable environment"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-transparent to-emerald-500/20" />

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 p-5 rounded-xl"
              >
                <div className="text-emerald-400 text-sm font-medium mb-1">Global Impact</div>
                <div className="text-white text-2xl font-bold mb-1">2.5M</div>
                <p className="text-slate-400 text-sm">Tons CO2 Reduced</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-2 mb-6">
                <span className="text-emerald-400 text-sm font-medium">Impact</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Making a Measurable
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Difference Together
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Join our community of environmentally conscious individuals committed to reducing their carbon footprint. Together, we are creating real, quantifiable change for our planet.
              </p>
            </motion.div>

            {/* Impact stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {impacts.map((impact, index) => (
                <motion.div
                  key={impact.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-5 hover:border-emerald-500/30 transition-all duration-300">
                    <impact.icon className="w-5 h-5 text-emerald-400 mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{impact.value}</div>
                    <div className="text-white text-sm font-medium mb-1">{impact.label}</div>
                    <p className="text-slate-500 text-xs">{impact.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}