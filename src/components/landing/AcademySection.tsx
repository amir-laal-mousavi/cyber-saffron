import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export function AcademySection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-8 mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
              <BookOpen className="w-3 h-3 mr-2" />
              Cyber Saffron Academy
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Master the Art of <span className="text-primary">Saffron</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Dive deep into the world of the red gold. Learn about our blockchain verification process, 
              culinary secrets, and the rich history of saffron through our curated educational content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/academy")}
                className="group"
              >
                Explore the Academy
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-video md:aspect-auto md:h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop" 
                alt="Saffron Academy" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary text-primary-foreground border-none">New</Badge>
                  <span className="text-sm font-medium text-white/80">Latest Article</span>
                </div>
                <h3 className="text-xl font-bold mb-1">The Art & Science of Saffron</h3>
                <p className="text-sm text-white/70 line-clamp-2">
                  Explore our curated library covering everything from ancient history to blockchain verification.
                </p>
              </div>
            </div>
            
            {/* Floating cards/elements for visual interest */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border border-border/50 hidden md:block max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="text-sm font-bold">Free Knowledge</div>
              </div>
              <p className="text-xs text-muted-foreground">Access expert guides and recipes at no cost.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
