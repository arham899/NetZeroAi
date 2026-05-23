import { useCalculator } from "../../../store/calculatorStore";

export default function ReviewStep() {
  const { formData } = useCalculator();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h3>
        <p className="text-gray-600">Please review all the information you've entered before submitting. You can go back to any step to make changes.</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
        <h4 className="font-semibold text-emerald-900 mb-4">Summary of Your Responses</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-emerald-100 pb-2">
            <span className="text-gray-700 font-medium">1. Location</span>
            <span className="text-emerald-600 italic">
              {formData.location.city ? `${formData.location.city}, ${formData.location.state} ${formData.location.postalCode}, ${formData.location.country}` : "Not Specified"}
            </span>
          </div>
          <div className="flex justify-between border-b border-emerald-100 pb-2">
            <span className="text-gray-700">2. Electricity Usage</span>
            <span className="text-gray-600">→ Filled</span>
          </div>
          <div className="flex justify-between border-b border-emerald-100 pb-2">
            <span className="text-gray-700">3. Fuel & Heating</span>
            <span className="text-gray-600">→ Filled</span>
          </div>
          <div className="flex justify-between border-b border-emerald-100 pb-2">
            <span className="text-gray-700">4. Transportation</span>
            <span className="text-gray-600">→ Filled</span>
          </div>
          <div className="flex justify-between border-b border-emerald-100 pb-2">
            <span className="text-gray-700">5. Water & Waste</span>
            <span className="text-gray-600">→ Filled</span>
          </div>
          <div className="flex justify-between border-b border-emerald-100 pb-2">
            <span className="text-gray-700">6. Industry & Consumption</span>
            <span className="text-gray-600">→ Filled</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">7. Carbon Offsets</span>
            <span className="text-gray-600">→ Filled</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <p className="text-green-900 font-medium mb-2">✓ All steps complete</p>
        <p className="text-green-800 text-sm">
          Click the "Submit & Calculate" button below to calculate your carbon footprint and see your personalized results.
        </p>
      </div>
    </div>
  );
}
