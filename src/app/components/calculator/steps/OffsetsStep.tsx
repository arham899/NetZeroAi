import { Input } from "../../ui/input";
import { useCalculator } from "../../../store/calculatorStore";

export default function OffsetsStep() {
  const { formData, updateOffsets } = useCalculator();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Carbon Offsets</h3>
        <p className="text-gray-600">Tell us about your carbon reduction and offset activities.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trees Planted (lifetime)
          </label>
          <Input
            type="number"
            placeholder="e.g., 5"
            value={formData.offsets.treesPlanted}
            onChange={(e) =>
              updateOffsets({ treesPlanted: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total trees planted by you
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Green Energy Usage (%)
          </label>
          <Input
            type="number"
            placeholder="e.g., 25"
            value={formData.offsets.greenEnergyPercentage}
            onChange={(e) =>
              updateOffsets({ greenEnergyPercentage: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Percentage of renewable energy used
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carbon Offset Purchases (kg CO₂e)
          </label>
          <Input
            type="number"
            placeholder="e.g., 500"
            value={formData.offsets.offsetPurchasesDollars}
            onChange={(e) =>
              updateOffsets({ offsetPurchasesDollars: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Carbon offsets purchased annually
          </p>
        </div>
      </div>
    </div>
  );
}
