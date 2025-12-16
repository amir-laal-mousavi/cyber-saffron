import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function ProductManagement() {
  const products = useQuery(api.products.list);
  const updateProduct = useMutation(api.admin.updateProduct);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Product Inventory</h2>
      <div className="grid grid-cols-1 gap-6">
        {products?.map((product) => (
          <Card key={product._id}>
            <CardContent className="p-6 flex items-center gap-6">
              <div className="h-24 w-24 rounded-lg bg-muted overflow-hidden shrink-0">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                <div className="flex gap-4">
                  <Badge variant="outline">{product.tier}</Badge>
                  <Badge variant="outline">{product.weight}</Badge>
                </div>
              </div>
              <div className="w-48 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price (USD)</span>
                  <Input 
                    type="number" 
                    defaultValue={product.priceUsd}
                    className="w-24 h-8"
                    onBlur={(e) => updateProduct({ 
                      productId: product._id, 
                      priceUsd: parseFloat(e.target.value) 
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <Input 
                    type="number" 
                    defaultValue={product.stock || 100}
                    className="w-24 h-8"
                    onBlur={(e) => updateProduct({ 
                      productId: product._id, 
                      stock: parseInt(e.target.value) 
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
