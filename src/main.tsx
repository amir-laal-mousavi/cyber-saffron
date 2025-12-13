import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect, lazy, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './lib/wagmi';
import "./index.css";
import "./types/global.d.ts";
import { AgentInitializer } from "@/components/AgentInitializer";
import { SaffronLoader } from "@/components/SaffronLoader";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const NetworkVisualization = lazy(() => import("./pages/NetworkVisualization.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Route loading with saffron flower animation
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SaffronLoader />
    </div>
  );
}

// Global Interaction Loader for instant feedback
function GlobalInteractionLoader() {
  useEffect(() => {
    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for links
      const link = target.closest('a');
      if (link) {
        const href = link.getAttribute('href');
        const targetAttr = link.getAttribute('target');
        
        // Ignore if new tab, hash anchor, or protocol link
        if (
          targetAttr === '_blank' || 
          !href || 
          href.startsWith('#') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') ||
          href.startsWith('javascript:')
        ) {
          return;
        }
        
        // Show loader
        const overlay = document.getElementById('global-loader-overlay');
        if (overlay) {
          overlay.style.display = 'flex';
        }
        return;
      }
      
      // Check for submit buttons
      const button = target.closest('button');
      if (button && button.type === 'submit') {
        // Only show loader if the button is inside a form
        // This prevents the loader from triggering on buttons that just open dialogs/drawers
        if (button.closest('form')) {
          const overlay = document.getElementById('global-loader-overlay');
          if (overlay) {
            overlay.style.display = 'flex';
          }
        }
      }
    };

    document.addEventListener('click', handleInteraction, true);
    return () => document.removeEventListener('click', handleInteraction, true);
  }, []);

  return (
    <div 
      id="global-loader-overlay" 
      style={{ display: 'none' }}
      className="fixed inset-0 z-[10002] bg-background/80 backdrop-blur-sm items-center justify-center"
    >
      <SaffronLoader />
    </div>
  );
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const queryClient = new QueryClient();

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

// Route transition wrapper with blur effect
function RouteTransitionWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    // Hide global loader when route change completes (simulated by timeout or actual effect)
    const overlay = document.getElementById('global-loader-overlay');
    if (overlay) {
      // We keep it visible until the transition effect takes over, then hide it
      // or just let the transition wrapper handle the visual.
      // Actually, we should hide the overlay once the new route mounts/transition starts
      // to avoid double loaders.
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 100);
    }

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-background/50 backdrop-blur-sm"
          >
            <SaffronLoader />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{
          filter: isTransitioning ? "blur(8px)" : "blur(0px)",
          transition: "filter 0.3s ease-in-out",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <ConvexAuthProvider client={convex}>
              <AgentInitializer />
              <GlobalInteractionLoader />
              <BrowserRouter>
                <RouteSyncer />
                <RouteTransitionWrapper>
                  <Suspense fallback={<RouteLoading />}>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/auth" element={<AuthPage redirectAfterAuth="/" />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/network" element={<NetworkVisualization />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </RouteTransitionWrapper>
              </BrowserRouter>
              <Toaster />
            </ConvexAuthProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </InstrumentationProvider>
  </StrictMode>,
);