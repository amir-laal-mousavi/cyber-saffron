import { Button } from "@/components/ui/button";
import { Hexagon, ShoppingCart, User } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from "react-router";
import { CartDrawer } from "@/components/CartDrawer";
import { useAuth } from "@/hooks/use-auth";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ProductsSection } from "@/components/landing/ProductsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { AcademySection } from "@/components/landing/AcademySection";

export default function Landing() {
  const products = useQuery(api.products.list);
  const seedProducts = useMutation(api.products.seed);
  const cart = useQuery(api.cart.get);
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    seedProducts();
  }, [seedProducts]);

  // ScrollSpy: Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "products", "features", "academy", "trust"];
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 100; // Adjusted for floating nav
      const targetPosition = section.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL hash without jumping
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      {createPortal(
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-2 md:px-4 pointer-events-none">
          <nav className="pointer-events-auto w-full max-w-6xl rounded-2xl border border-border/40 bg-background/75 backdrop-blur-xl shadow-lg supports-[backdrop-filter]:bg-background/40 transition-all duration-300">
            <div className="flex h-16 items-center justify-between px-6 md:px-8">
            <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity cursor-pointer">
              <Hexagon className="h-6 w-6 text-primary fill-primary/20 shrink-0" />
              <span className="hidden sm:inline">CYBER SAFFRON</span>
            </a>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              {["about", "products", "features", "academy", "trust"].map((section) => (
                <a 
                  key={section}
                  href={`#${section}`}
                  className={`hover:text-primary transition-colors cursor-pointer relative ${
                    activeSection === section ? "text-primary font-semibold" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(section);
                  }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1).replace("features", "Process").replace("products", "Collection")}
                  {activeSection === section && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <ConnectButton 
                    showBalance={false}
                    accountStatus="avatar"
                    chainStatus="none"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/profile")}
                    title="Profile"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              )}
            </div>
            </div>
          </nav>
        </div>,
        document.body
      )}

      <HeroSection onGetStarted={() => scrollToSection('products')} />
      <AboutSection />
      <ProductsSection products={products} />
      <FeaturesSection />
      <AcademySection />
      <TrustSection />

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-muted/20">
        <div className="container px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 mx-auto">
          <div className="flex items-center gap-2 font-bold">
            <Hexagon className="h-5 w-5 text-primary" />
            <span>CYBER SAFFRON</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Cyber Saffron. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground cursor-pointer">Terms</a>
            <a href="#" className="hover:text-foreground cursor-pointer">Privacy</a>
            <a href="#" className="hover:text-foreground cursor-pointer">Smart Contract</a>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] z-[9999]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Hexagon className="h-5 w-5 text-primary" />
              CYBER SAFFRON
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-8">
            {["about", "products", "features", "academy", "trust"].map((section) => (
              <a 
                key={section}
                href={`#${section}`}
                className={`text-lg font-medium hover:text-primary transition-colors cursor-pointer py-2 ${
                  activeSection === section ? "text-primary font-semibold" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section);
                  setMobileMenuOpen(false);
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace("features", "Process").replace("products", "Collection")}
              </a>
            ))}
            <div className="pt-4 border-t border-border">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}