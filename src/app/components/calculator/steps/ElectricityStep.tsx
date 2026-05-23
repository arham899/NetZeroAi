import { Input } from "../../ui/input";
import { useCalculator } from "../../../store/calculatorStore";

export default function ElectricityStep() {
  const { formData, updateElectricity } = useCalculator();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Electricity Usage</h3>
        <p className="text-gray-600">Enter your monthly electricity consumption to calculate your energy emissions.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Electricity Usage (kWh)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            type="number"
            placeholder="e.g., 500"
            value={formData.electricity.monthlyUsageKwh}
            onChange={(e) =>
              updateElectricity({ monthlyUsageKwh: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Check your electricity bill for this number
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Renewable Energy Percentage (%)
          </label>
          <Input
            type="number"
            placeholder="e.g., 20"
            value={formData.electricity.renewablePercentage}
            onChange={(e) =>
              updateElectricity({ renewablePercentage: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            If you use solar, wind, or green energy (0-100%)
          </p>
        </div>
      </div>
    </div>
  );
}
