import { motion } from 'motion/react';
import {
    BarChart2, TrendingUp, Target, Leaf, Zap,
    Users, Globe, Home,
    Heart, Info, Download, Trash2, Calendar, History} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCalculator } from '../store/calculatorStore';
import { aggregateEmissions } from '../utils/calculations/aggregator';
import { useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer, PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip,
    LineChart, Line, CartesianGrid
} from 'recharts';
import { exportHistoryToCSV } from '../utils/export/exportUtils';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function Dashboard() {
    const { formData, history, clearHistory } = useCalculator();
    const navigate = useNavigate();
    const results = aggregateEmissions(formData);

    // Tonnes to KG for user-friendly display
    const totalKg = results.netCO2e * 1000;
    const treesNeeded = Math.ceil(totalKg / 22); // 1 tree absorbs ~22kg/year

    const pieData = [
        { name: 'Transport', value: results.breakdown.transport * 1000 },
        { name: 'Energy', value: (results.breakdown.electricity + results.breakdown.fuel) * 1000 },
        { name: 'Consumption', value: results.breakdown.industry * 1000 },
        { name: 'Waste/Water', value: results.breakdown.waterWaste * 1000 },
    ].filter(item => item.value > 0);

    const comparisonData = [
        { name: 'Your Impact', value: totalKg },
        { name: 'Global Avg', value: 4700 }, // World avg approx 4.7t
        { name: 'US Avg', value: 14000 }, // US avg approx 14t
        { name: 'Target', value: 2000 }, // Sustainable target
    ];

    // Prepare trend data (last 7 entries)
    const trendData = [...history]
        .reverse()
        .slice(-7)
        .map(entry => ({
            date: new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            emissions: entry.totalKg
        }));

    const stats = [
        { icon: TrendingUp, label: 'Annual Footprint', value: totalKg.toFixed(0), unit: 'kg CO₂e', color: 'emerald' },
        { icon: Target, label: 'Target Distance', value: (totalKg - 2000).toFixed(0), unit: 'kg to goal', color: 'blue' },
        { icon: Leaf, label: 'Offset Needed', value: treesNeeded, unit: 'trees', color: 'green' },
        { icon: Zap, label: 'Primary Source', value: pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : 'N/A', unit: 'Top Category', color: 'yellow' },
    ];

    return (
        <div className="relative min-h-screen bg-slate-50/50">
            <div className="relative z-10 pt-24 pb-12">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 rounded-full px-4 py-1.5 mb-4">
                                <BarChart2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Live Analysis</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 leading-tight">
                                Sustainability <span className="text-emerald-500">Dashboard</span>
                            </h1>
                        </motion.div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => exportHistoryToCSV(history)}
                                className="border-gray-200 text-gray-600 hover:bg-gray-50 gap-2"
                                disabled={history.length === 0}
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/calculator')}
                                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                                Refine Data
                            </Button>
                            <Button
                                onClick={() => navigate('/results', {
                                    state: {
                                        totalEmissions: (results.netCO2e * 1000).toFixed(0),
                                        breakdown: {
                                            transportation: (results.breakdown.transport * 1000).toFixed(0),
                                            energy: ((results.breakdown.electricity + results.breakdown.fuel) * 1000).toFixed(0),
                                            food: (results.breakdown.industry * 1000).toFixed(0),
                                            lifestyle: (results.breakdown.waterWaste * 1000).toFixed(0),
                                        },
                                        formData
                                    }
                                })}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                            >
                                Full Report
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2.5 rounded-xl bg-${stat.color}-50`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-gray-900">{stat.value}</span>
                                    <span className="text-sm font-bold text-gray-400">{stat.unit}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Analytics Row */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Category Breakdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="lg:col-span-1 bg-white border border-emerald-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-pink-500" />
                                Impact Breakdown
                            </h3>
                            <div className="h-64 mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-8 space-y-3">
                                {pieData.map((item, index) => (
                                    <div key={item.name} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-gray-600 font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-gray-900 font-bold">{item.value.toFixed(0)} kg</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Benchmark Comparison */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2 bg-white border border-emerald-100 rounded-[2.5rem] p-8 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-blue-500" />
                                    Benchmark Comparison
                                </h3>
                                <div className="bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-600 uppercase">
                                    Annual Estimates
                                </div>
                            </div>
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={comparisonData}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} hide />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                            {comparisonData.map((entry) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={entry.name === 'Your Impact' ? '#10b981' : '#e2e8f0'}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="mt-6 text-sm text-gray-500 flex items-center gap-2">
                                <Info className="w-4 h-4 text-emerald-400" />
                                Compared to average residents in high-income regions. The target for 2030 is 2,000kg/person.
                            </p>
                        </motion.div>
                    </div>

                    {/* History & Trends Row */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Trend Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 bg-white border border-emerald-100 rounded-[2.5rem] p-8 shadow-sm"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                Emissions Trend
                            </h3>
                            <div className="h-[300px]">
                                {history.length > 1 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="emissions"
                                                stroke="#10b981"
                                                strokeWidth={4}
                                                dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 8, strokeWidth: 0 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-full">
                                            <BarChart2 className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="text-sm font-medium">Add more calculations to see your trend</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Recent History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-1 bg-white border border-emerald-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <History className="w-5 h-5 text-blue-500" />
                                    Recent History
                                </h3>
                                {history.length > 0 && (
                                    <button
                                        onClick={clearHistory}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Clear History"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                {history.length > 0 ? (
                                    history.map((entry) => (
                                        <div
                                            key={entry.id}
                                            onClick={() => navigate('/results', {
                                                state: {
                                                    totalEmissions: entry.totalKg.toFixed(0),
                                                    breakdown: {
                                                        transportation: entry.breakdown.transport.toFixed(0),
                                                        energy: entry.breakdown.energy.toFixed(0),
                                                        food: entry.breakdown.consumption.toFixed(0),
                                                        lifestyle: entry.breakdown.waste.toFixed(0),
                                                    },
                                                    formData: entry.formData || { location: entry.location }
                                                }
                                            })}
                                            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group hover:border-emerald-200 transition-colors cursor-pointer"
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                        {new Date(entry.date).toLocaleDateString()}
                                                    </span>
                                                    {entry.isQuick && (
                                                        <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-black uppercase">Quick</span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">{entry.totalKg.toFixed(0)} kg CO₂e</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-sm text-gray-400">No calculation history yet</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Insight Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { color: 'bg-emerald-500', icon: Users, title: 'Network Influence', desc: 'Share your progress to inspire 5 friends to join the movement.' },
                            { color: 'bg-blue-500', icon: Home, title: 'Energy Milestone', desc: 'Switching to 100% solar could reduce your footprint by 35%.' },
                            { color: 'bg-amber-500', icon: Target, title: 'Next Milestone', desc: 'Reduce airline travel by 2 hours/month to hit Net Zero faster.' },
                        ].map((insight, index) => (
                            <motion.div
                                key={insight.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                                className="group bg-white border border-emerald-100 rounded-3xl p-6 hover:bg-emerald-600 transition-all duration-500 overflow-hidden relative"
                            >
                                <div className={`inline-flex p-3 rounded-2xl ${insight.color} text-white mb-6 group-hover:bg-white/20 transition-colors`}>
                                    <insight.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors">{insight.title}</h4>
                                <p className="text-gray-500 group-hover:text-emerald-100 transition-colors">{insight.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Separate component for ArrowRight icon since it was used but not imported
function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
