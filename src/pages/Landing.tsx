import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Box, CheckCircle, Hexagon, ShieldCheck, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from "react-router";
import { CartDrawer } from "@/components/CartDrawer";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const products = useQuery(api.products.list);
  const seedProducts = useMutation(api.products.seed);
  const cart = useQuery(api.cart.get);
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    seedProducts();
  }, [seedProducts]);

  // ScrollSpy: Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "products", "features", "trust"];
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
      const navbarHeight = 64; // h-16 = 64px
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
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
          <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity cursor-pointer">
            <Hexagon className="h-6 w-6 text-primary fill-primary/20 shrink-0" />
            <span className="hidden sm:inline">CYBER SAFFRON</span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a 
              href="#about" 
              className={`hover:text-primary transition-colors cursor-pointer relative ${
                activeSection === "about" ? "text-primary font-semibold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
            >
              About
              {activeSection === "about" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </a>
            <a 
              href="#products" 
              className={`hover:text-primary transition-colors cursor-pointer relative ${
                activeSection === "products" ? "text-primary font-semibold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('products');
              }}
            >
              Collection
              {activeSection === "products" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </a>
            <a 
              href="#features" 
              className={`hover:text-primary transition-colors cursor-pointer relative ${
                activeSection === "features" ? "text-primary font-semibold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}
            >
              Process
              {activeSection === "features" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </a>
            <a 
              href="#trust" 
              className={`hover:text-primary transition-colors cursor-pointer relative ${
                activeSection === "trust" ? "text-primary font-semibold" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('trust');
              }}
            >
              Trust
              {activeSection === "trust" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </a>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden h-[80vh] min-h-[600px] flex items-center justify-center">
        {/* Full Width/Height Saffron Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1599909533730-f9d49c0c5b8e?w=1920&q=90')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
        </div>
        
        {/* Text Content Directly on Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto"
        >
          <Badge 
            variant="outline" 
            className="w-fit mx-auto bg-white/20 backdrop-blur-sm border-white/40 text-white font-semibold"
          >
            Verified on Blockchain
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
            Experience Clarity & Focus
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Our platform brings your goals into sharp focus while filtering out the noise.
          </p>
          
          <div className="pt-4">
            <Button 
              size="lg" 
              className="bg-white hover:bg-white/90 text-black font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              onClick={() => scrollToSection('products')}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                About Cyber Saffron
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Revolutionizing the saffron industry through blockchain technology and transparent supply chains
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border/50 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=90"
                    alt="Saffron fields"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  At Cyber Saffron, we're bridging the gap between traditional saffron cultivation and modern blockchain technology. Every thread of our premium saffron is verified on the blockchain, ensuring complete transparency from harvest to delivery.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We empower a network of trusted agents worldwide, creating opportunities for entrepreneurs while maintaining the highest quality standards. Our ISO-certified processes guarantee that you receive authentic, premium-grade saffron every time.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    Blockchain Verified
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">
                    ISO Certified
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20">
                    Direct from Source
                  </Badge>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-8 md:py-10 bg-muted/30">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-2 text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">The Collection</h2>
            <p className="max-w-[600px] text-muted-foreground text-sm md:text-base">
              Choose your tier of exclusivity. Each package comes with a digital twin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products ? (
              products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full flex flex-col overflow-hidden border-border/40 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 group cursor-pointer">
                    <div className="aspect-[16/9] overflow-hidden relative bg-gradient-to-br from-muted to-muted/50" onClick={() => navigate(`/product/${product._id}`)}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110 group-hover:brightness-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-background/90 backdrop-blur-md text-foreground border-border/50 shadow-lg">{product.tier}</Badge>
                      </div>
                    </div>
                    <CardHeader onClick={() => navigate(`/product/${product._id}`)} className="pb-2 pt-4 px-4">
                      <CardTitle className="text-lg leading-tight font-bold tracking-tight">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="font-mono text-primary text-xs mt-1 font-semibold">{product.weight}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 py-2 px-4" onClick={() => navigate(`/product/${product._id}`)}> 
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1 leading-relaxed">{product.description}</p>
                      <ul className="space-y-1.5 text-xs">
                        {product.features.slice(0, 2).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-secondary shrink-0" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-0 border-t border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-2xl font-bold font-mono tracking-tight">${product.priceUsd}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{product.priceEth} ETH</span>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg transition-all" onClick={() => navigate(`/product/${product._id}`)}>
                          View
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="h-[320px] animate-pulse bg-muted/50" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background"></div>
        <div className="container px-4 md:px-8 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Transparent Process</h2>
            <p className="max-w-[600px] text-muted-foreground">
              From the fields of Iran to your doorstep, tracked immutably.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { title: "Harvesting", icon: Box, desc: "Hand-picked premium threads" },
                { title: "Lab Testing", icon: ShieldCheck, desc: "ISO certified quality check" },
                { title: "Minting", icon: Hexagon, desc: "Blockchain verification" },
                { title: "Delivery", icon: ShoppingBag, desc: "Secure global shipping" },
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center bg-background border border-border p-6 rounded-xl shadow-sm hover:border-primary/50 transition-colors"
                >
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4 border border-secondary/20">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="py-16 border-t border-border/50">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Trusted & Verified</h3>
              <p className="text-muted-foreground">Certified by international standards and blockchain technology.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-xl">
                <ShieldCheck className="h-8 w-8" />
                <span>ISO 3632</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-xl">
                <Hexagon className="h-8 w-8" />
                <span>Polygon</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-xl">
                <Box className="h-8 w-8" />
                <span>Etherscan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}