import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Car, Home, UtensilsCrossed, Heart, ArrowLeft, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { TreeRecommendations } from "../components/results/TreeRecommendations";

interface ResultsData {
  totalEmissions: string;
  breakdown: {
    transportation: string;
    energy: string;
    food: string;
    lifestyle: string;
  };
  formData?: {
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
}

const breakdownItems = [
  {
    label: "Transportation",
    icon: Car,
    color: "from-blue-400 to-blue-600",
    key: "transportation",
  },
  {
    label: "Home Energy",
    icon: Home,
    color: "from-emerald-400 to-emerald-600",
    key: "energy",
  },
  {
    label: "Diet",
    icon: UtensilsCrossed,
    color: "from-green-400 to-green-600",
    key: "food",
  },
  {
    label: "Lifestyle",
    icon: Heart,
    color: "from-pink-400 to-pink-600",
    key: "lifestyle",
  },
];

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsData | null;

  // Fallback if no data is passed
  const data = state || {
    totalEmissions: "0",
    breakdown: {
      transportation: "0",
      energy: "0",
      food: "0",
      lifestyle: "0",
    },
  };

  const total = parseFloat(data.totalEmissions);
  const getDayEquivalent = () => {
    const treesNeeded = (total / 25).toFixed(1); // Average mature tree absorbs ~25kg CO2/year
    const drivingDays = (total / 20).toFixed(1); // Average car emits ~20kg per 100km
    return { treesNeeded, drivingDays };
  };

  const { treesNeeded } = getDayEquivalent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/calculator")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Calculator
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Carbon Footprint Results
          </h1>
          <p className="text-xl text-gray-600">
            Here's a breakdown of your estimated annual carbon emissions.
          </p>
        </motion.div>

        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 md:p-12 text-white mb-12 shadow-lg"
        >
          <p className="text-emerald-100 mb-2">Your Annual Carbon Footprint</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-bold">{data.totalEmissions}</span>
            <span className="text-2xl">kg CO₂e</span>
          </div>
          <p className="mt-6 text-emerald-100">
            That's equivalent to {treesNeeded} trees needed to offset your emissions annually.
          </p>
        </motion.div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {breakdownItems.map((item, index) => {
            const IconComponent = item.icon;
            const value = parseFloat(
              data.breakdown[item.key as keyof typeof data.breakdown]
            );
            const percentage = ((value / total) * 100).toFixed(1);

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`bg-gradient-to-br ${item.color} p-3 rounded-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
                  </div>
                  <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {percentage}%
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-2xl font-bold text-gray-900">{value.toFixed(0)}</span>
                    <span className="text-sm text-gray-500">kg CO₂e/year</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all`}
                      style={{
                        width: `${(value / total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-4">💡 Ways to Reduce Your Impact</h2>
          <ul className="space-y-3 text-blue-800">
            <li className="flex gap-3">
              <span className="font-semibold">•</span>
              <span>Switch to renewable energy or green energy plans from your utility</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">•</span>
              <span>Reduce meat consumption and try plant-based meals</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">•</span>
              <span>Use public transportation, carpool, or drive an electric vehicle</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">•</span>
              <span>Buy less, choose sustainable products, and recycle more</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">•</span>
              <span>Improve home insulation to reduce heating and cooling needs</span>
            </li>
          </ul>
        </motion.div>

        {/* AI Tree Recommendations */}
        <div className="mb-12">
          <TreeRecommendations
            location={
              data.formData?.location
                ? `${data.formData.location.city || ''}, ${data.formData.location.country || ''}`.trim().replace(/^,|,$/g, '') || "your area"
                : "your area"
            }
            carbonFootprint={total}
          />
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Button
            onClick={() => navigate("/calculator")}
            size="lg"
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Recalculate
          </Button>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Report
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
