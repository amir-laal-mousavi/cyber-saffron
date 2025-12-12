import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Box, CheckCircle, Hexagon, ShieldCheck } from "lucide-react";

export function TrustSection() {
  return (
    <section id="trust" className="min-h-screen flex items-center py-20 md:py-28 border-t border-border/50 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 md:px-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Trusted & Verified
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Certified by international standards and secured by blockchain technology. Every transaction is transparent and traceable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">ISO 3632 Certified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our saffron meets the highest international quality standards for color strength, flavor, and aroma. Laboratory tested and certified.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Hexagon className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Blockchain Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every product is minted as a digital twin on Polygon blockchain. Track your saffron's journey from harvest to delivery with immutable proof.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-xl">Etherscan Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All smart contracts are publicly verified on Etherscan. Complete transparency in every transaction, commission, and referral.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Our Certifications & Partners</h3>
              <p className="text-sm text-muted-foreground">
                Recognized by leading organizations and powered by cutting-edge blockchain infrastructure
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 items-center">
              <Badge variant="outline" className="px-4 py-2 text-base bg-background/80">
                <ShieldCheck className="h-5 w-5 mr-2" />
                ISO 3632-2
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base bg-background/80">
                <Hexagon className="h-5 w-5 mr-2" />
                Polygon Network
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base bg-background/80">
                <Box className="h-5 w-5 mr-2" />
                Etherscan Verified
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
