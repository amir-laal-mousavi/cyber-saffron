import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
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
  );
}
