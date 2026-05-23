import CalculatorWizard from "../components/calculator/CalculatorWizard";

export default function Calculator() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10" style={{ minHeight: '100vh', paddingTop: '6rem' }}>
        <CalculatorWizard />
      </div>
    </div>
  );
}

