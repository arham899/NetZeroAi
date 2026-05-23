import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <Navigation />
            <main>{children}</main>
            <Footer />
        </>
    );
}

