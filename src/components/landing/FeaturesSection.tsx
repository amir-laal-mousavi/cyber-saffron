import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Box, CheckCircle, Hexagon, ShieldCheck, ShoppingBag } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="min-h-screen flex items-center py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background"></div>
      <div className="container px-4 md:px-8 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Transparent Process</h2>
            <p className="max-w-[700px] text-lg text-muted-foreground mb-6">
              From the fields of Iran to your doorstep, every step is tracked immutably on the blockchain.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                100% Traceable
              </Badge>
              <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">
                Real-time Updates
              </Badge>
              <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20">
                Verified Quality
              </Badge>
            </div>
          </motion.div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {[
              { 
                title: "Harvesting", 
                icon: Box, 
                desc: "Hand-picked premium threads",
                details: "Carefully selected from the finest saffron fields in Iran during peak harvest season. Each thread is inspected for quality and color.",
                step: "Step 1"
              },
              { 
                title: "Lab Testing", 
                icon: ShieldCheck, 
                desc: "ISO certified quality check",
                details: "Rigorous laboratory analysis for crocin, picrocrocin, and safranal content. Certified to meet ISO 3632-2 standards.",
                step: "Step 2"
              },
              { 
                title: "Minting", 
                icon: Hexagon, 
                desc: "Blockchain verification",
                details: "Digital twin created on Polygon blockchain with immutable proof of origin, quality certificates, and supply chain data.",
                step: "Step 3"
              },
              { 
                title: "Delivery", 
                icon: ShoppingBag, 
                desc: "Secure global shipping",
                details: "Temperature-controlled packaging and tracked shipping worldwide. Your saffron arrives fresh with complete blockchain history.",
                step: "Step 4"
              },
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center bg-gradient-to-br from-card to-card/80 border border-border p-6 rounded-xl shadow-lg hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                    {step.step}
                  </Badge>
                </div>
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center text-secondary mb-4 border-2 border-secondary/30 shadow-md">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-sm font-medium text-primary mb-3">{step.desc}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.details}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Every step is recorded on the blockchain for complete transparency</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
