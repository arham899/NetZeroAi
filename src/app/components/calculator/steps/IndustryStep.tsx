import { Input } from "../../ui/input";
import { useCalculator } from "../../../store/calculatorStore";

export default function IndustryStep() {
  const { formData, updateIndustry } = useCalculator();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Consumption & Diet</h3>
        <p className="text-gray-600">Tell us about your shopping and eating habits.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly New Items Purchased
          </label>
          <Input
            type="number"
            placeholder="e.g., 10"
            value={formData.industry.shoppingItemsPurchasedPerYear}
            onChange={(e) =>
              updateIndustry({ shoppingItemsPurchasedPerYear: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Average number of new items per month
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Meat Servings
          </label>
          <Input
            type="number"
            placeholder="e.g., 5"
            value={formData.industry.meatServingsPerWeek}
            onChange={(e) =>
              updateIndustry({ meatServingsPerWeek: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Servings of beef, pork, or chicken per week
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Dairy Servings
          </label>
          <Input
            type="number"
            placeholder="e.g., 7"
            value={formData.industry.dairyServingsPerWeek}
            onChange={(e) =>
              updateIndustry({ dairyServingsPerWeek: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Servings of milk, cheese, or yogurt per week
          </p>
        </div>
      </div>
    </div>
  );
}
