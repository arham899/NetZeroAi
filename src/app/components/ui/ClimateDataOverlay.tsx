import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Globe, Newspaper, ExternalLink } from 'lucide-react';
import { CO2_BY_COUNTRY, GLOBAL_CO2_DATA, CO2CountryData } from '../../utils/climateData';
import { fetchClimateNews, ClimateNewsArticle } from '../../services/climateNewsService';

interface ClimateDataOverlayProps {
    visible: boolean;
    variant?: 'emissions' | 'news' | 'both';
}

export function ClimateDataOverlay({ visible, variant = 'both' }: ClimateDataOverlayProps) {
    const [news, setNews] = useState<ClimateNewsArticle[]>([]);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    // Fetch news on mount
    useEffect(() => {
        fetchClimateNews(5).then(setNews);
    }, []);

    // Rotate news every 5 seconds
    useEffect(() => {
        if (news.length === 0) return;
        const interval = setInterval(() => {
            setCurrentNewsIndex((prev) => (prev + 1) % news.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [news]);

    return (
        <AnimatePresence>
            {visible && (
                <div className="fixed inset-0 pointer-events-none z-20">
                    {/* CO2 Emissions Panel - Left Side */}
                    {(variant === 'emissions' || variant === 'both') && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.5 }}
                            className="absolute left-4 bottom-24 pointer-events-auto max-w-xs"
                        >
                            <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-4 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Global CO₂ Emissions</h3>
                                        <p className="text-xs text-gray-500">2024 Data | Source: EDGAR/IEA</p>
                                    </div>
                                </div>

                                {/* Total Emissions Counter */}
                                <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Total Annual Emissions</p>
                                    <div className="flex items-baseline gap-2">
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-4xl font-bold text-red-600"
                                        >
                                            {GLOBAL_CO2_DATA.totalEmissions}
                                        </motion.span>
                                        <span className="text-lg text-gray-600">Gt CO₂</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        +{GLOBAL_CO2_DATA.yearOverYearChange}% from 2023
                                    </p>
                                </div>

                                {/* Country Breakdown */}
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        By Country
                                    </p>
                                    {CO2_BY_COUNTRY.slice(0, 5).map((country: CO2CountryData, index: number) => (
                                        <motion.div
                                            key={country.country}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-24 text-sm text-gray-700">{country.country}</div>
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${country.percentage}%` }}
                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: country.color }}
                                                />
                                            </div>
                                            <div className="w-12 text-xs text-gray-600 text-right">
                                                {country.percentage}%
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Source Attribution */}
                                <p className="mt-4 text-[10px] text-gray-400 flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    Data: EDGAR GHG 2025 Report, IEA Global Energy Review
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Climate News Panel - Right Side */}
                    {(variant === 'news' || variant === 'both') && news.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.5 }}
                            className="absolute right-4 bottom-24 pointer-events-auto max-w-sm"
                        >
                            <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-4 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                        <Newspaper className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Climate News</h3>
                                        <p className="text-xs text-gray-500">Live updates from GDELT</p>
                                    </div>
                                </div>

                                {/* News Carousel */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentNewsIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="p-4 bg-gray-50 rounded-xl"
                                    >
                                        <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                                            {news[currentNewsIndex]?.title}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className="font-medium text-blue-600">
                                                    {news[currentNewsIndex]?.source}
                                                </span>
                                                <span>•</span>
                                                <span>{news[currentNewsIndex]?.country}</span>
                                            </div>
                                            <a
                                                href={news[currentNewsIndex]?.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-600"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* News Indicators */}
                                <div className="flex justify-center gap-1 mt-3">
                                    {news.slice(0, 5).map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-colors ${index === currentNewsIndex ? 'bg-blue-500' : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Source Attribution */}
                                <p className="mt-4 text-[10px] text-gray-400 flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    Powered by GDELT Project - Global News Monitoring
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </AnimatePresence>
    );
}
