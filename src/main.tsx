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
const Academy = lazy(() => import("./pages/Academy.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Route loading with saffron flower animation
function RouteLoading() {
  return <SaffronLoader />;
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
            className="fixed inset-0 z-[9999] pointer-events-none"
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
                      <Route path="/academy" element={<Academy />} />
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