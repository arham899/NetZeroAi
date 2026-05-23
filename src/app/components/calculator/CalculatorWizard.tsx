import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCalculator } from "../../store/calculatorStore";
import { aggregateEmissions } from "../../utils/calculations/aggregator";
import * as Validators from "../../utils/validation/calculatorValidation";
import StepSelector from "./StepSelector";
import ElectricityStep from "./steps/ElectricityStep";
import FuelStep from "./steps/FuelStep";
import TransportStep from "./steps/TransportStep";
import WaterWasteStep from "./steps/WaterWasteStep";
import IndustryStep from "./steps/IndustryStep";
import OffsetsStep from "./steps/OffsetsStep";
import ReviewStep from "./steps/ReviewStep";
import LocationStep from "./steps/LocationStep";
import EntityTypeStep from "./steps/EntityTypeStep";

interface StepDefinition {
  id: string;
  label: string;
  component: React.ComponentType;
}

const STEPS: StepDefinition[] = [
  { id: "entity-type", label: "Entity Type", component: EntityTypeStep },
  { id: "location", label: "Location", component: LocationStep },
  { id: "electricity", label: "Electricity", component: ElectricityStep },
  { id: "fuel", label: "Fuel", component: FuelStep },
  { id: "transport", label: "Transport", component: TransportStep },
  { id: "water-waste", label: "Water & Waste", component: WaterWasteStep },
  { id: "industry", label: "Industry", component: IndustryStep },
  { id: "offsets", label: "Offsets", component: OffsetsStep },
  { id: "review", label: "Review", component: ReviewStep },
];

export default function CalculatorWizard() {
  const navigate = useNavigate();
  const { formData, addToHistory } = useCalculator();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = STEPS[currentStepIndex];
  const CurrentStepComponent = currentStep.component;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const validateCurrentStep = () => {
    const stepId = STEPS[currentStepIndex].id;
    let errors: Record<string, string> = {};

    switch (stepId) {
      case "entity-type":
        if (!formData.entityType) {
          errors.entityType = "Please select an entity type";
        }
        break;
      case "electricity":
        errors = Validators.validateElectricity(formData.electricity);
        break;
      case "fuel":
        errors = Validators.validateFuel(formData.fuel);
        break;
      case "transport":
        errors = Validators.validateTransport(formData.transport);
        break;
      case "water-waste":
        errors = Validators.validateWaterWaste(formData.waterWaste);
        break;
      // Add more cases as needed
    }

    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      // Potentially show a toast or alert
      console.warn("Validation errors:", errors);
      alert("Please fix the errors in this step before proceeding.");
    }
    return !hasErrors;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (!isLastStep) {
        setCurrentStepIndex((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleStepChange = (index: number) => {
    setCurrentStepIndex(index);
  };

  const handleSubmit = () => {
    const results = aggregateEmissions(formData);

    // Total KG
    const totalKg = results.netCO2e * 1000;

    // Save to history
    addToHistory({
      totalKg,
      breakdown: {
        transport: results.breakdown.transport * 1000,
        energy: (results.breakdown.electricity + results.breakdown.fuel) * 1000,
        consumption: results.breakdown.industry * 1000,
        waste: results.breakdown.waterWaste * 1000,
      },
      isQuick: false,
      formData: formData // Pass the current form data so it can be restored
    });

    const formattedResults = {
      totalEmissions: totalKg.toFixed(0),
      breakdown: {
        transportation: (results.breakdown.transport * 1000).toFixed(0),
        energy: ((results.breakdown.electricity + results.breakdown.fuel) * 1000).toFixed(0),
        food: (results.breakdown.industry * 1000).toFixed(0),
        lifestyle: (results.breakdown.waterWaste * 1000).toFixed(0),
      },
      formData: formData
    };

    navigate('/results', { state: formattedResults });
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-full px-5 py-2.5 mb-6">
            <span className="text-emerald-700 text-sm font-medium">Full Calculator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Carbon Footprint
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Let's calculate your carbon emissions step by step.
          </p>
        </motion.div>

        {/* Step Selector */}
        <StepSelector
          steps={STEPS}
          currentStepIndex={currentStepIndex}
          onStepChange={handleStepChange}
        />

        {/* Step Content */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl border border-emerald-200/50 p-8 md:p-12 mb-8 min-h-96 shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentStepComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={handleBack}
            disabled={isFirstStep}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>

          <div className="text-sm text-gray-600">
            {currentStepIndex + 1} / {STEPS.length}
          </div>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Submit & Calculate
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
