import { Input } from "../../ui/input";
import { useCalculator } from "../../../store/calculatorStore";

export default function FuelStep() {
  const { formData, updateFuel } = useCalculator();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Fuel & Heating</h3>
        <p className="text-gray-600">Enter your home heating fuel consumption for the year.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Natural Gas Usage (therms)
          </label>
          <Input
            type="number"
            placeholder="e.g., 400"
            value={formData.fuel.naturalGasThermsPeYear}
            onChange={(e) =>
              updateFuel({ naturalGasThermsPeYear: e.target.value })
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Found on your utility bill
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Heating Oil Usage (gallons)
          </label>
          <Input
            type="number"
            placeholder="e.g., 500"
            value={formData.fuel.heatingOilGallonsPerYear}
            onChange={(e) =>
              updateFuel({ heatingOilGallonsPerYear: e.target.value })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Propane Usage (gallons)
          </label>
          <Input
            type="number"
            placeholder="e.g., 300"
            value={formData.fuel.propaneGallonsPerYear}
            onChange={(e) =>
              updateFuel({ propaneGallonsPerYear: e.target.value })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
