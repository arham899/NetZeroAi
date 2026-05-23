import { RouteObject } from "react-router-dom";
import { ScrollytellingHome } from "./pages/ScrollytellingHome";
import Calculator from "./pages/Calculator";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

/**
 * Routes Configuration
 * 
 * This file defines all application routes using react-router-dom's RouteObject format.
 * Each route maps a URL path to a page component that renders within MainLayout.
 */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <ScrollytellingHome />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/calculator",
    element: <Calculator />,
  },
  {
    path: "/results",
    element: <Results />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
