import { Input } from "../../ui/input";
import { useCalculator } from "../../../store/calculatorStore";

export default function WaterWasteStep() {
  const { formData, updateWaterWaste } = useCalculator();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Water & Waste</h3>
        <p className="text-gray-600">Provide information about your water and waste generation.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Water Usage (gallons)
          </label>
          <Input
            type="number"
            placeholder="e.g., 50000"
            value={formData.waterWaste.waterUsageGallonsPerYear}
            onChange={(e) =>
              updateWaterWaste({ waterUsageGallonsPerYear: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Check your water utility bill
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Waste Generated (kg)
          </label>
          <Input
            type="number"
            placeholder="e.g., 500"
            value={formData.waterWaste.wasteGeneratedLbsPerYear}
            onChange={(e) =>
              updateWaterWaste({ wasteGeneratedLbsPerYear: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Estimate total trash you produce yearly
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recycled Percentage (%)
          </label>
          <Input
            type="number"
            placeholder="e.g., 30"
            value={formData.waterWaste.recyclingPercentage}
            onChange={(e) =>
              updateWaterWaste({ recyclingPercentage: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            What percent of your waste do you recycle?
          </p>
        </div>
      </div>
    </div>
  );
}
