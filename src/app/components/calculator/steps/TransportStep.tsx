import { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Input } from "../../ui/input";
import { useCalculator } from "../../../store/calculatorStore";
import { Vehicle, VehicleType } from "../../../types/calculatorTypes";
import { FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";

export default function TransportStep() {
  const { formData, updateTransport } = useCalculator();
  const { numberOfVehicles, vehicles, hasExcelUpload, excelUploaded } = formData.transport;

  // Local state for UI feedback
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle number of vehicles change
  const handleCountChange = (value: string) => {
    const count = parseInt(value) || 1;
    updateTransport({ numberOfVehicles: value });

    // Resize vehicles array
    // Create new array based on count, preserving existing data where possible
    const currentVehicles = vehicles || [];
    const newVehicles: Vehicle[] = [];

    for (let i = 0; i < count; i++) {
      if (i < currentVehicles.length) {
        newVehicles.push(currentVehicles[i]);
      } else {
        newVehicles.push({
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          milesPerYear: "",
          type: "sedan"
        });
      }
    }

    updateTransport({ vehicles: newVehicles });

    // Auto-enable excel option if > 5
    if (count > 5) {
      // Don't auto-check, but make sure the option is visible.
    } else {
      // If dropping below 5, maybe disable excel? keeping it flexible.
    }
  };

  // Update individual vehicle
  const updateVehicle = (index: number, field: keyof Vehicle, value: string) => {
    const newVehicles = [...(vehicles || [])];
    newVehicles[index] = { ...newVehicles[index], [field]: value };
    updateTransport({ vehicles: newVehicles });
  };

  // Handle Excel Upload
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadError(null);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet) as any[];

      // Expected format: Column A: Type, Column B: Miles
      // Or checking keys "Type", "Miles"

      const newVehicles: Vehicle[] = parsedData.map((row: any, idx) => ({
        id: `excel-${idx}`,
        type: (row['Type'] || row['type'] || 'sedan').toLowerCase() as VehicleType,
        milesPerYear: (row['Miles'] || row['miles'] || row['Annual Miles'] || 0).toString()
      }));

      if (newVehicles.length === 0) {
        throw new Error("No valid data found in file.");
      }

      updateTransport({
        vehicles: newVehicles,
        numberOfVehicles: newVehicles.length.toString(),
        excelUploaded: true
      });

    } catch (err) {
      console.error("Excel parse error:", err);
      setUploadError("Failed to parse Excel file. Please ensure columns are 'Type' and 'Miles'.");
    }
  };

  const showExcelOption = (parseInt(numberOfVehicles) || 0) > 5;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Transportation</h3>
        <p className="text-gray-600">Tell us about your fleet or individual vehicles.</p>
      </div>

      <div className="space-y-6">

        {/* Number of Vehicles Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Number of Vehicles
          </label>
          <Input
            type="number"
            min="1"
            max="1000"
            value={numberOfVehicles}
            onChange={(e) => handleCountChange(e.target.value)}
            className="w-full text-lg"
          />
        </div>

        {/* Excel Upload Option */}
        {showExcelOption && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="useExcel"
                checked={hasExcelUpload}
                onChange={(e) => updateTransport({ hasExcelUpload: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
              />
              <label htmlFor="useExcel" className="text-sm font-medium text-gray-700">
                I am sending an Excel file with vehicle details
              </label>
            </div>

            {hasExcelUpload && (
              <div className="ml-8 space-y-4">
                <div className="p-6 border-2 border-dashed border-emerald-200 rounded-xl bg-white hover:bg-emerald-50 transition-colors text-center group cursor-pointer relative">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    {excelUploaded ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    ) : (
                      <FileSpreadsheet className="w-10 h-10 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                    )}
                    <span className="text-sm font-medium text-gray-600">
                      {excelUploaded ? "File Uploaded Successfully!" : "Drop Excel file here or click to browse"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Columns required: 'Type' (Sedan, SUV, etc.) and 'Miles'
                    </span>
                  </div>
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {uploadError}
                  </div>
                )}

                {excelUploaded && (
                  <div className="text-sm text-emerald-700 font-medium">
                    Calculated for {vehicles?.length} vehicles from file.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual Vehicle Entry */}
        {(!showExcelOption || !hasExcelUpload) && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Vehicle Details</span>
              <span className="text-xs text-gray-400">{vehicles?.length || 0} Vehicles</span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {vehicles && vehicles.map((vehicle, index) => (
                <div key={vehicle.id || index} className="grid grid-cols-12 gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                  <div className="col-span-1 flex items-center justify-center pt-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  <div className="col-span-6 md:col-span-7">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Miles / Year</label>
                    <Input
                      type="number"
                      value={vehicle.milesPerYear}
                      onChange={(e) => updateVehicle(index, 'milesPerYear', e.target.value)}
                      placeholder="10000"
                      className="bg-white"
                    />
                  </div>

                  <div className="col-span-5 md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                    <select
                      value={vehicle.type}
                      onChange={(e) => updateVehicle(index, 'type', e.target.value as VehicleType)}
                      className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="truck">Truck</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                      <option value="motorcycle">Motorcycle</option>
                    </select>
                  </div>
                </div>
              ))}

              {(!vehicles || vehicles.length === 0) && (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-400">No vehicles added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-gray-100 mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Flight Hours (All Travelers)
          </label>
          <Input
            type="number"
            placeholder="e.g., 20"
            value={formData.transport.flightHoursPerYear}
            onChange={(e) =>
              updateTransport({ flightHoursPerYear: e.target.value })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
