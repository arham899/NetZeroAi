import { useRoutes, useLocation } from "react-router-dom";
import { useEffect, useState} from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MainLayout } from "./layouts/MainLayout";
import { routes } from "./Router";
import { IntroAnimation } from "./components/ui/IntroAnimation";

// Key for sessionStorage
const INTRO_SHOWN_KEY = 'carbon_calc_intro_shown';

export default function App() {
  const routeElements = useRoutes(routes);
  const location = useLocation();
 // const isFirstMount = useRef(true);

  // Determine if we should show intro:
  // 1. On first deploy/visit (no sessionStorage flag)
  // 2. On direct page refresh of home page (navigation type = reload AND on home page)
  // We should NOT show intro when navigating from another page to home
  const shouldShowIntro = () => {
    // Check if this is a page reload (refresh)
    const isPageRefresh = performance.navigation?.type === 1 ||
      (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload';

    // Check if intro was already shown in this session
    const introShownInSession = sessionStorage.getItem(INTRO_SHOWN_KEY) === 'true';

    // If on home page and this is a refresh, show intro
    if (location.pathname === '/' && isPageRefresh) {
      return true;
    }

    // If first ever visit (no flag), show intro
    if (!introShownInSession && location.pathname === '/') {
      return true;
    }

    // Otherwise, don't show intro (e.g., navigating from calc page to home)
    return false;
  };

  const [showIntro, setShowIntro] = useState(shouldShowIntro);

  // Refresh ScrollTrigger on route changes and visibility changes
  useEffect(() => {
    // Small delay to ensure DOM is ready after route change
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    // Handle page visibility changes (when switching tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible - refresh ScrollTrigger
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    // Handle window focus (when returning to tab)
    const handleFocus = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [location.pathname]);

  // Scrollytelling home page has its own layout with fixed elements
  const isScrollytellingPage = location.pathname === "/";

  // Handle intro completion - set flag so it doesn't show again on navigation
  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_SHOWN_KEY, 'true');
    setShowIntro(false);
  };

  if (isScrollytellingPage) {
    return (
      <div key={location.pathname}>
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        {routeElements}
      </div>
    );
  }

  return (
    <MainLayout key={location.pathname}>
      {routeElements}
    </MainLayout>
  );
}
