import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TreeDeciduous, Leaf, Droplets, Sun, RefreshCw, MapPin, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/apiService';

interface TreeSpecies {
    name: string;
    scientificName: string;
    description: string;
    carbonImpactPercent: number;
    co2PerYear: number;
    growthRate: string;
    image: string | null;
    origin?: string[];
    hardinessZone?: string;
    droughtTolerant?: boolean;
    sunlight?: string[];
}

interface TreeData {
    summary_message: string;
    trees: TreeSpecies[];
    isFallback: boolean;
}

interface TreeRecommendationsProps {
    location: string;
    carbonFootprint: number;
}

export function TreeRecommendations({ location, carbonFootprint }: TreeRecommendationsProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TreeData | null>(null);

    const fetchRecommendations = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiService.getTreeSpecies(location, carbonFootprint);
            setData(result);
        } catch (err: any) {
            console.error('Failed to load tree species:', err);
            setError(err.response?.data?.message || 'Failed to load tree recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location && carbonFootprint) {
            fetchRecommendations();
        }
    }, [location, carbonFootprint]);

    // ========================================================================
    // LOADING STATE
    // ========================================================================
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-3xl p-10 text-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <TreeDeciduous className="absolute inset-0 m-auto text-emerald-600 w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Analyzing Regional Flora</h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Finding the best carbon-offsetting trees for {location}...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================================================
    // ERROR STATE
    // ========================================================================
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={fetchRecommendations}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-semibold transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // ========================================================================
    // SUCCESS STATE — TREE CARDS
    // ========================================================================
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Section Header */}
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                    <TreeDeciduous className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        🌳 Recommended Trees for Carbon Offset
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">{data.summary_message}</p>
                    {data.isFallback && (
                        <span className="inline-block mt-2 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                            ⚡ General best choices — location-specific species unavailable
                        </span>
                    )}
                </div>
            </div>

            {/* Tree Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.trees.map((tree, index) => (
                    <motion.div
                        key={tree.name + index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.12, duration: 0.5 }}
                        className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500 overflow-hidden flex flex-col"
                    >
                        {/* Tree Image */}
                        <div className="relative h-48 overflow-hidden">
                            {tree.image ? (
                                <img
                                    src={tree.image}
                                    alt={tree.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <div className={`${tree.image ? 'hidden' : ''} w-full h-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center`}>
                                <TreeDeciduous className="w-16 h-16 text-white/60" />
                            </div>

                            {/* Carbon Impact Badge (overlay on image) */}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-sm font-bold text-emerald-700">
                                        {tree.carbonImpactPercent}%
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">CO₂ Impact</p>
                            </div>

                            {/* Growth Rate Tag */}
                            <div className="absolute bottom-3 left-3">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm ${tree.growthRate === 'High'
                                        ? 'bg-emerald-500/90 text-white'
                                        : tree.growthRate === 'Moderate'
                                            ? 'bg-amber-500/90 text-white'
                                            : 'bg-slate-500/90 text-white'
                                    }`}>
                                    {tree.growthRate} Growth
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex flex-col flex-1">
                            {/* Tree Name */}
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                                {tree.name}
                            </h3>
                            <p className="text-xs text-emerald-600/80 font-medium italic mt-0.5 mb-3">
                                {tree.scientificName}
                            </p>

                            {/* Description */}
                            <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                                {tree.description}
                            </p>

                            {/* Carbon Sequestration Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Carbon Reduction Impact
                                    </span>
                                    <span className="text-sm font-bold text-emerald-600">
                                        ~{tree.co2PerYear} kg/yr
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${tree.carbonImpactPercent}%` }}
                                        transition={{ delay: index * 0.12 + 0.4, duration: 1, ease: 'easeOut' }}
                                        className={`h-full rounded-full ${tree.carbonImpactPercent >= 80
                                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                                                : tree.carbonImpactPercent >= 50
                                                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                                    : 'bg-gradient-to-r from-slate-300 to-slate-400'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Quick Info Tags */}
                            <div className="flex flex-wrap gap-1.5">
                                {tree.hardinessZone && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5">
                                        <MapPin className="w-3 h-3" />
                                        Zone {tree.hardinessZone}
                                    </span>
                                )}
                                {tree.droughtTolerant && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-500 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5">
                                        <Droplets className="w-3 h-3" />
                                        Drought Tolerant
                                    </span>
                                )}
                                {tree.sunlight && tree.sunlight.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5">
                                        <Sun className="w-3 h-3" />
                                        {tree.sunlight[0]}
                                    </span>
                                )}
                                {tree.growthRate && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-0.5">
                                        <Leaf className="w-3 h-3" />
                                        {tree.co2PerYear} kg CO₂/yr
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-center gap-3">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 text-sm font-medium">
                    Powered by Perenual Botanical Database & NetZero AI
                </span>
            </div>
        </motion.div>
    );
}
