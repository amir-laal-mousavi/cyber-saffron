import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, DollarSign, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NetworkNode {
  id: string;
  name: string;
  tier: string;
  totalSales: number;
  children: NetworkNode[];
}

interface NetworkTreeNodeProps {
  node: NetworkNode;
  isRoot?: boolean;
  depth?: number;
}

function NetworkTreeNode({ node, isRoot = false, depth = 0 }: NetworkTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2); // Auto-expand first 2 levels

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "gold": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "silver": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card
          className={`
            w-64 p-4 cursor-pointer transition-all duration-200
            hover:shadow-lg hover:border-primary/50 hover:-translate-y-1
            ${isRoot ? "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30" : "bg-card"}
          `}
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{node.name}</p>
              {isRoot && (
                <Badge variant="outline" className="mt-1 text-xs bg-green-500/10 text-green-500 border-green-500/20">
                  You
                </Badge>
              )}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Units Sold</p>
                <p className="font-bold text-sm">0</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Income</p>
                <p className="font-bold text-sm text-green-500">
                  ${node.totalSales.toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <Badge variant="outline" className={getTierColor(node.tier)}>
              {node.tier.toUpperCase()}
            </Badge>
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Connector line to children */}
        {hasChildren && isExpanded && (
          <div className="absolute left-1/2 -bottom-6 w-0.5 h-6 bg-border -translate-x-1/2" />
        )}
      </motion.div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 relative"
        >
          {/* Horizontal connector line */}
          {node.children.length > 1 && (
            <div
              className="absolute top-0 left-0 right-0 h-0.5 bg-border"
              style={{
                left: `${(1 / node.children.length) * 50}%`,
                right: `${(1 / node.children.length) * 50}%`,
              }}
            />
          )}

          <div className="flex gap-8 justify-center items-start">
            {node.children.map((child) => (
              <div key={child.id} className="relative">
                {/* Vertical connector to parent */}
                <div className="absolute left-1/2 -top-6 w-0.5 h-6 bg-border -translate-x-1/2" />
                <NetworkTreeNode node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface NetworkTreeProps {
  data: NetworkNode | null;
}

export function NetworkTree({ data }: NetworkTreeProps) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No network data available</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start recruiting agents to build your network
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max p-8 flex justify-center">
        <NetworkTreeNode node={data} isRoot={true} />
      </div>
    </div>
  );
}
