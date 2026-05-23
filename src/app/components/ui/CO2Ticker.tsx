import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';

const co2Data = [
    { value: '2,847', label: 'Tons CO2 Saved Today' },
    { value: '156,382', label: 'Trees Planted Equivalent' },
    { value: '89,421', label: 'Users Active This Month' },
    { value: '12.5M', label: 'Total Emissions Tracked' },
    { value: '456,892', label: 'Carbon Offsets Purchased' },
    { value: '98.7%', label: 'User Satisfaction Rate' },
    { value: '34,567', label: 'Companies Partnered' },
    { value: '8.2B', label: 'Data Points Analyzed' },
];

export function CO2Ticker() {
    const tickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ticker = tickerRef.current;
        if (!ticker) return;

        let animationId: number;
        let scrollPos = 0;
        const speed = 0.5;

        const animate = () => {
            scrollPos += speed;
            if (scrollPos >= ticker.scrollHeight / 2) {
                scrollPos = 0;
            }
            ticker.scrollTop = scrollPos;
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="relative h-80 overflow-hidden">
            {/* Top gradient mask - light theme */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

            {/* Bottom gradient mask - light theme */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

            {/* Ticker content */}
            <div
                ref={tickerRef}
                className="h-full overflow-hidden"
                style={{ scrollBehavior: 'auto' }}
            >
                <div className="space-y-4">
                    {/* Duplicate data for seamless loop */}
                    {[...co2Data, ...co2Data].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl hover:border-emerald-400 transition-colors shadow-sm"
                        >
                            <span className="text-2xl font-bold text-emerald-600">{item.value}</span>
                            <span className="text-gray-600 text-sm">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
