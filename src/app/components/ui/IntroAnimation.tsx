import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * IntroAnimation - Premium preloader with liquid fill and zoom-through exit
 * Rebranded to NetZero AI
 */

interface IntroAnimationProps {
    onComplete?: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
    const [phase, setPhase] = useState<'filling' | 'zoom' | 'done'>('filling');
    const [fillLevel, setFillLevel] = useState(0);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const fillDuration = 3000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / fillDuration, 1);

            const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            setFillLevel(eased * 100);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setTimeout(() => setPhase('zoom'), 500);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            document.body.style.overflow = '';
        };
    }, []);

    const handleZoomComplete = () => {
        setPhase('done');
        document.body.style.overflow = '';
        onComplete?.();
    };

    if (phase === 'done') {
        return null;
    }


    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center"
                style={{ backgroundColor: '#0C0908' }}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Main Content - Centered */}
                <motion.div
                    className="relative"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{
                        scale: phase === 'zoom' ? 50 : 1,
                        opacity: phase === 'zoom' ? 0 : 1,
                    }}
                    transition={{
                        duration: phase === 'zoom' ? 1.0 : 0,
                        ease: [0.7, 0, 0.84, 0],
                    }}
                    onAnimationComplete={() => {
                        if (phase === 'zoom') {
                            handleZoomComplete();
                        }
                    }}
                    style={{ transformOrigin: 'center center' }}
                >
                    {/* Large centered SVG text - NetZero AI */}
                    <svg
                        viewBox="0 0 500 100"
                        className="w-[90vw] max-w-[800px] h-auto"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Wavy turbulence filter */}
                            <filter id="wave" x="-10%" y="-10%" width="120%" height="130%">
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.015"
                                    numOctaves="2"
                                    result="noise"
                                    seed="2"
                                >
                                    <animate
                                        attributeName="baseFrequency"
                                        values="0.015;0.025;0.015"
                                        dur="2s"
                                        repeatCount="indefinite"
                                    />
                                </feTurbulence>
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="noise"
                                    scale="6"
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                />
                            </filter>

                            {/* Clip path for liquid level */}
                            <clipPath id="liquidClip">
                                <rect
                                    x="0"
                                    y={100 - fillLevel}
                                    width="500"
                                    height="120"
                                />
                            </clipPath>

                            {/* Mask for "NetZero" text */}
                            <mask id="netZeroMask">
                                <rect width="500" height="100" fill="black" />
                                <text
                                    x="0"
                                    y="70"
                                    fontFamily="'Inter', 'Segoe UI', sans-serif"
                                    fontSize="80"
                                    fontWeight="700"
                                    fill="white"
                                    letterSpacing="-2"
                                >
                                    NetZero
                                </text>
                            </mask>

                            {/* Mask for "AI" text */}
                            <mask id="aiMask">
                                <rect width="500" height="100" fill="black" />
                                <text
                                    x="350"
                                    y="70"
                                    fontFamily="'Inter', 'Segoe UI', sans-serif"
                                    fontSize="80"
                                    fontWeight="700"
                                    fill="white"
                                    letterSpacing="-2"
                                >
                                    AI
                                </text>
                            </mask>
                        </defs>

                        {/* "NetZero" - Dark gray container */}
                        <g mask="url(#netZeroMask)">
                            <rect width="500" height="100" fill="#4a4a4a" />
                        </g>

                        {/* "NetZero" - White liquid fill */}
                        <g mask="url(#netZeroMask)" clipPath="url(#liquidClip)">
                            <rect
                                width="500"
                                height="100"
                                fill="white"
                                filter="url(#wave)"
                            />
                        </g>

                        {/* "AI" - Dark gray container */}
                        <g mask="url(#aiMask)">
                            <rect width="500" height="100" fill="#4a4a4a" />
                        </g>

                        {/* "AI" - Green liquid fill */}
                        <g mask="url(#aiMask)" clipPath="url(#liquidClip)">
                            <rect
                                width="500"
                                height="100"
                                fill="#10B981"
                                filter="url(#wave)"
                            />
                        </g>
                    </svg>

                    {/* Subtitle */}
                    <div className="text-center -mt-4 relative z-20">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="text-emerald-300 text-sm font-bold tracking-[0.1em] uppercase block transform -rotate-1 italic"
                        >
                            Carbon Accounting with AI analytics
                        </motion.span>
                    </div>

                    {/* Loading indicator - Right below text */}
                    <div className="flex justify-end mt-10 pr-1">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm tracking-widest uppercase font-medium">loading</span>
                            <span className="text-emerald-400 text-sm font-bold tabular-nums">
                                {Math.round(fillLevel)}%
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Background fade during zoom */}
                {phase === 'zoom' && (
                    <motion.div
                        className="absolute inset-0 bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
}
