import { motion } from "motion/react";
import { ArrowRight, Check, Zap, Gift, Unlock } from "lucide-react";
import { Button } from "../ui/button";
import { useInView } from "../../hooks/useInView";

const benefits = [
  { icon: Check, text: "No credit card required" },
  { icon: Zap, text: "Instant results" },
  { icon: Gift, text: "Free forever" },
  { icon: Unlock, text: "Cancel anytime" },
];

export function CTASection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-slate-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />

      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Calculate Your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Carbon Footprint?
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              Begin your sustainability journey today. In just five minutes, receive a personalized
              carbon footprint analysis and actionable recommendations for reducing your environmental impact.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 rounded-xl text-base font-medium shadow-xl shadow-emerald-500/20">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="border border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-600 px-8 py-6 rounded-xl text-base font-medium transition-all duration-300"
              >
                View Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Benefits list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 text-slate-400"
              >
                <benefit.icon className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom accent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 pt-12 border-t border-slate-800"
          >
            <p className="text-slate-500 text-sm">
              Join over 50,000 users committed to environmental sustainability
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}