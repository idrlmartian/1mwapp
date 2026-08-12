import Footer from "@/app/components/site/Footer";
import Header from "@/app/components/site/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            {/* No pt-16: the header is sticky, not fixed, so it occupies flow. */}
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
