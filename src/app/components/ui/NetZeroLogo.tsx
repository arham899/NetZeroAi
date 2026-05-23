import { motion } from 'motion/react';

interface NetZeroLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function NetZeroLogo({ className = '', size = 'md' }: NetZeroLogoProps) {
    const sizes = {
        sm: { height: 32, fontSize: 14, subText: 8 },
        md: { height: 40, fontSize: 18, subText: 10 },
        lg: { height: 56, fontSize: 24, subText: 12 },
    };

    const { height, fontSize, subText } = sizes[size];

    return (
        <motion.div
            className={`flex items-center gap-3 ${className}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
        >
            {/* Globe Icon with Cloud and Arrows */}
            <svg
                height={height}
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                {/* Main circular arrow around globe */}
                <path
                    d="M 8 25 A 17 17 0 1 1 25 42"
                    stroke="#1E6B8C"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Arrow head */}
                <path
                    d="M 5 22 L 8 27 L 13 24"
                    stroke="#1E6B8C"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Globe body */}
                <circle cx="25" cy="25" r="12" fill="none" stroke="#2B8C5E" strokeWidth="1.5" />

                {/* Globe horizontal lines */}
                <ellipse cx="25" cy="25" rx="12" ry="5" fill="none" stroke="#2B8C5E" strokeWidth="1" />
                <ellipse cx="25" cy="25" rx="12" ry="9" fill="none" stroke="#2B8C5E" strokeWidth="0.8" opacity="0.6" />

                {/* Globe vertical line */}
                <ellipse cx="25" cy="25" rx="5" ry="12" fill="none" stroke="#2B8C5E" strokeWidth="1" />

                {/* Cloud */}
                <path
                    d="M 32 12 C 32 10 34 8 37 8 C 40 8 42 10 42 12 C 44 12 46 14 46 16 C 46 19 44 20 41 20 L 33 20 C 30 20 28 18 28 15 C 28 13 30 12 32 12 Z"
                    fill="white"
                    stroke="#1E6B8C"
                    strokeWidth="1.5"
                />

                {/* Data points on globe */}
                <circle cx="20" cy="22" r="2" fill="#1E6B8C" />
                <circle cx="28" cy="28" r="2" fill="#3BB371" />

                {/* Connection line */}
                <line x1="21" y1="23" x2="27" y2="27" stroke="#1E6B8C" strokeWidth="1" strokeDasharray="2,1" />

                {/* Trend arrow going up */}
                <path
                    d="M 30 20 L 38 14"
                    stroke="#1E6B8C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    d="M 35 13 L 39 13 L 39 17"
                    stroke="#1E6B8C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>

            {/* Text */}
            <div className="flex flex-col">
                <div className="flex items-center gap-1" style={{ fontSize }}>
                    <span className="font-bold text-[#1E3A5F] tracking-tight">NetZer</span>
                    {/* O with leaf */}
                    <span className="relative font-bold text-[#1E3A5F]">
                        o
                        <svg
                            className="absolute -top-0.5 -right-1"
                            width="8"
                            height="10"
                            viewBox="0 0 10 12"
                        >
                            <path
                                d="M 5 0 C 8 2 9 5 7 8 C 5 11 2 10 2 7 C 2 4 4 2 5 0 Z"
                                fill="#3BB371"
                            />
                            <path d="M 5 4 L 5 9" stroke="#2B8C5E" strokeWidth="0.8" />
                        </svg>
                    </span>
                    <span className="font-bold text-[#1E3A5F] ml-1">AI</span>
                </div>
                <span
                    className="text-[#5A7A94] tracking-wide"
                    style={{ fontSize: subText }}
                >
                    Carbon Accounting with AI Analytics
                </span>
            </div>
        </motion.div>
    );
}
