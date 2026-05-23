import { User, Users, Building, Factory } from "lucide-react";
import { useCalculator } from "../../../store/calculatorStore";
import { EntityType } from "../../../types/calculatorTypes";
import { motion } from "motion/react";

export default function EntityTypeStep() {
    const { formData, updateEntityType } = useCalculator();

    const options: { id: EntityType; label: string; icon: React.ElementType; description: string }[] = [
        {
            id: "individual",
            label: "Individual",
            icon: User,
            description: "Calculate your personal carbon footprint."
        },
        {
            id: "family",
            label: "Family",
            icon: Users,
            description: "Estimate emissions for your entire household."
        },
        {
            id: "business",
            label: "Business",
            icon: Building,
            description: "For small to medium enterprises."
        },
        {
            id: "company",
            label: "Company",
            icon: Factory,
            description: "Detailed analysis for large corporations."
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Who are you calculating for?</h3>
                <p className="text-gray-600">
                    Select the option that best describes you or your organization to tailor the calculator experience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {options.map((option) => {
                    const isSelected = formData.entityType === option.id;
                    const Icon = option.icon;

                    return (
                        <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateEntityType(option.id)}
                            className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${isSelected
                                    ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10"
                                    : "border-gray-100 bg-white hover:border-emerald-200 hover:shadow-md"
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600"
                                }`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h4 className={`text-lg font-bold mb-2 ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>
                                {option.label}
                            </h4>
                            <p className={`text-sm ${isSelected ? "text-emerald-700" : "text-gray-500"}`}>
                                {option.description}
                            </p>

                            {isSelected && (
                                <motion.div
                                    layoutId="checkmark"
                                    className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
