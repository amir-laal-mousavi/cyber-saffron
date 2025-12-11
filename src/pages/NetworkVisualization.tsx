import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { NetworkTree } from "@/components/NetworkTree";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function NetworkVisualization() {
  const navigate = useNavigate();
  const networkTree = useQuery(api.agents.getNetworkTree, { depth: 5 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/profile");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-lg">Network Hierarchy Visualization</h1>
              <p className="text-xs text-muted-foreground">
                Drag to pan • Scroll to zoom • ESC to exit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-mono min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetView}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Visualization Canvas */}
      <div
        ref={containerRef}
        className="flex-1 relative bg-muted/20 cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
          transition={{ type: "tween", duration: 0.1 }}
        >
          <div className="min-h-full flex items-start justify-center pt-12">
            {networkTree ? (
              <NetworkTree data={networkTree} />
            ) : (
              <div className="text-center py-12">
                <div className="animate-pulse text-muted-foreground">
                  Loading network data...
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-md border border-border rounded-lg px-4 py-2 shadow-lg">
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span>🖱️ Click & Drag to Pan</span>
          <span>🔍 Scroll to Zoom</span>
          <span>⌨️ ESC to Exit</span>
        </div>
      </div>
    </div>
  );
}
