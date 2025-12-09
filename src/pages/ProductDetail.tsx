import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const product = useQuery(api.products_extended.getById, { productId: id as Id<"products"> });
  const addToCart = useMutation(api.cart.addItem);

  const [selectedVariant, setSelectedVariant] = useState<"1g" | "5g" | "10g">("1g");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const variants = [
    { label: "1 Gram", value: "1g" as const, multiplier: 1 },
    { label: "5 Grams", value: "5g" as const, multiplier: 5 },
    { label: "10 Grams", value: "10g" as const, multiplier: 10 },
  ];

  const currentVariant = variants.find((v) => v.value === selectedVariant);
  const calculatedPriceUsd = product ? product.priceUsd * (currentVariant?.multiplier || 1) * quantity : 0;
  const calculatedPriceEth = product ? product.priceEth * (currentVariant?.multiplier || 1) * quantity : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product._id,
        quantity,
        variant: selectedVariant,
      });
      toast.success("Added to cart!", {
        description: `${quantity}x ${product.name} (${selectedVariant})`,
      });
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="ml-4 font-semibold">Product Details</span>
        </div>
      </header>

      {/* Product Detail */}
      <div className="container px-4 md:px-8 py-12 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24">
              <div className="aspect-square rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden shadow-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex gap-2">
                {[product.image, product.image, product.image].map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <Badge className="mb-3">{product.tier}</Badge>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-primary">
                  ${calculatedPriceUsd.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground font-mono">
                  {calculatedPriceEth.toFixed(4)} ETH
                </span>
              </div>
            </div>

            {/* Package Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Package</label>
              <div className="flex gap-2">
                {variants.map((variant) => (
                  <Button
                    key={variant.value}
                    variant={selectedVariant === variant.value ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setSelectedVariant(variant.value)}
                  >
                    {variant.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-border rounded-md px-3 py-2 font-mono"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>

            {/* Features */}
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">What's Included</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Accordion Sections */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Product Description</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{product.description}</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Premium Iranian saffron, hand-picked and verified on the blockchain for authenticity.
                    Each thread represents centuries of tradition combined with modern technology.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="certificate">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Blockchain Certificate
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Every package comes with a unique NFT certificate stored on Polygon blockchain,
                    ensuring complete traceability from harvest to delivery.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Contract:</span>
                      <span>0x742d...3f8a</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Standard:</span>
                      <span>ERC-721</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping Information
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Free worldwide shipping on orders over $200</li>
                    <li>• Express delivery: 3-5 business days</li>
                    <li>• Standard delivery: 7-14 business days</li>
                    <li>• Secure packaging with temperature control</li>
                    <li>• Track your order in real-time via blockchain</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </div>
    </div>
  );
}