import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden h-screen min-h-[600px] flex items-center justify-center">
      {/* Full Width/Height Saffron Background Image */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1599909533730-f9d49c0c5b8e?w=1920&q=90')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better text contrast */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        ></motion.div>
      </motion.div>
      
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
            onClick={onGetStarted}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}