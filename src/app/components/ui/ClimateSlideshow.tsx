import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { CO2_BY_COUNTRY, GLOBAL_CO2_DATA, CO2CountryData } from '../../utils/climateData';

/**
 * CO2 Data Slideshow Component
 * Displays CO2 emissions data in a rolling carousel format
 */
export function ClimateSlideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // CO2 slides: overview + Top 5 countries
    const slides = [
        { type: 'overview' as const },
        ...CO2_BY_COUNTRY.slice(0, 5).map((country) => ({ type: 'country' as const, data: country })),
    ];

    const totalSlides = slides.length;

    // Auto-advance slides
    useEffect(() => {
        if (isPaused || totalSlides === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 4000);
        return () => clearInterval(interval);
    }, [totalSlides, isPaused]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    return (
        <div
            className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Global CO₂ Emissions</h3>
                        <p className="text-xs text-gray-500">Source: EDGAR/IEA 2024</p>
                    </div>
                </div>

                {/* Navigation arrows */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevSlide}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Slide Content */}
            <div className="min-h-[200px] relative">
                <AnimatePresence mode="wait">
                    {/* CO2 Overview Slide */}
                    {currentSlide === 0 && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0"
                        >
                            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-2">Total Annual Emissions (2024)</p>
                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="text-5xl font-bold text-emerald-600">
                                        {GLOBAL_CO2_DATA.totalEmissions}
                                    </span>
                                    <span className="text-xl text-gray-600">Gt CO₂</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                        +{GLOBAL_CO2_DATA.yearOverYearChange}% vs 2023
                                    </span>
                                    <span className="text-gray-500">
                                        {GLOBAL_CO2_DATA.atmosphericCO2} ppm atmospheric CO₂
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Country Slides */}
                    {currentSlide > 0 && currentSlide < slides.length && (
                        <motion.div
                            key={`country-${currentSlide}`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0"
                        >
                            {(() => {
                                const slide = slides[currentSlide];
                                if (slide.type !== 'country') return null;
                                const country = slide.data as CO2CountryData;
                                return (
                                    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-2xl font-bold text-gray-900">{country.country}</h4>
                                            <span
                                                className="px-4 py-2 rounded-full text-white font-bold text-lg"
                                                style={{ backgroundColor: country.color }}
                                            >
                                                {country.percentage}%
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${country.percentage}%` }}
                                                    transition={{ duration: 1 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: country.color }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-gray-600">
                                            Annual emissions: <span className="font-semibold text-gray-900">{country.emissions}</span>
                                        </p>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-1.5 mt-6">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-emerald-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                    />
                ))}
            </div>

            {/* Source Attribution */}
            <p className="mt-4 text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <Globe className="w-3 h-3" />
                Data: EDGAR GHG 2025 Report, IEA Global Energy Review
            </p>
        </div>
    );
}
