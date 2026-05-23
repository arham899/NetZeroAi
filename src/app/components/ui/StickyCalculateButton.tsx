import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';

interface StickyCalculateButtonProps {
    targetId?: string;
}

export function StickyCalculateButton({ targetId = 'calculator-section' }: StickyCalculateButtonProps) {
    const [isNearForm, setIsNearForm] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down a bit
            setIsVisible(window.scrollY > 200);

            // Check if near calculator section
            const formSection = document.getElementById(targetId);
            if (formSection) {
                const rect = formSection.getBoundingClientRect();
                const isNear = rect.top < window.innerHeight && rect.bottom > 0;
                setIsNearForm(isNear);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [targetId]);

    const scrollToCalculator = () => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{
                y: isVisible ? 0 : 100,
                opacity: isVisible ? 1 : 0,
                scale: isNearForm ? 1.1 : 1,
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={scrollToCalculator}
            className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-8 py-4 rounded-full
        font-medium shadow-2xl
        transition-all duration-500 cursor-pointer
        ${isNearForm
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-emerald-500/40'
                    : 'bg-white/90 backdrop-blur-xl border border-emerald-300 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50'
                }
      `}
        >
            <Calculator className={`w-5 h-5 ${isNearForm ? 'text-white' : 'text-emerald-600'}`} />
            <span className={isNearForm ? 'text-white' : 'text-emerald-700'}>
                Calculate Now
            </span>

            {/* Glow effect when near form */}
            {isNearForm && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl -z-10"
                />
            )}
        </motion.button>
    );
}
