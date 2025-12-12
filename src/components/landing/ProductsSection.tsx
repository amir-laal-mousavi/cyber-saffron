import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

interface ProductsSectionProps {
  products: any;
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const navigate = useNavigate();

  return (
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
            products.map((product: any, index: number) => (
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
                      {product.features.slice(0, 2).map((feature: string, i: number) => (
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
  );
}
