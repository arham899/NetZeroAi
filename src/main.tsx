import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LenisProvider } from "./app/providers/LenisProvider";
import { CalculatorProvider } from "./app/store/CalculatorProvider";
import { AuthProvider } from "./app/store/AuthContext";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <CalculatorProvider>
        <LenisProvider>
          <App />
        </LenisProvider>
      </CalculatorProvider>
    </AuthProvider>
  </BrowserRouter>
);