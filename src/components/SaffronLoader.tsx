import { motion } from "framer-motion";

export function SaffronLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(100, 180, 255, 0.2) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Saffron flower icon with opening animation */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="relative z-10"
        >
          {/* Center stem */}
          <motion.path
            d="M60 70 L60 50"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-primary"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Top center petal */}
          <motion.path
            d="M60 35 Q60 25, 60 20 Q60 25, 60 35"
            fill="currentColor"
            className="text-secondary"
            initial={{ scale: 0, opacity: 0, originX: "60px", originY: "35px" }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          />

          {/* Left top petal */}
          <motion.path
            d="M50 40 Q40 35, 35 32 Q40 37, 50 40"
            fill="currentColor"
            className="text-secondary"
            initial={{ scale: 0, opacity: 0, originX: "50px", originY: "40px" }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          />

          {/* Right top petal */}
          <motion.path
            d="M70 40 Q80 35, 85 32 Q80 37, 70 40"
            fill="currentColor"
            className="text-secondary"
            initial={{ scale: 0, opacity: 0, originX: "70px", originY: "40px" }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          />

          {/* Left middle petal */}
          <motion.path
            d="M45 50 Q30 48, 22 48 Q30 50, 45 50"
            fill="currentColor"
            className="text-secondary"
            initial={{ scale: 0, opacity: 0, originX: "45px", originY: "50px" }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          />

          {/* Right middle petal */}
          <motion.path
            d="M75 50 Q90 48, 98 48 Q90 50, 75 50"
            fill="currentColor"
            className="text-secondary"
            initial={{ scale: 0, opacity: 0, originX: "75px", originY: "50px" }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          />

          {/* Left bottom petal */}
          <motion.path
            d="M50 60 Q40 65, 35 70 Q42 65, 50 60"
            fill="currentColor"
            className="text-secondary"
            initial={{ scale: 0, opacity: 0, originX: "50px", originY: "60px" }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          />

          {/* Right bottom petal */}
          <motion.path
            d="M70 60 Q80 65, 85 70 Q78 65, 70 60"
            fill="currentColor"
            className="text-secondary"
            initial={{ scale: 0, opacity: 0, originX: "70px", originY: "60px" }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          />

          {/* Center stigma detail */}
          <motion.circle
            cx="60"
            cy="45"
            r="4"
            fill="currentColor"
            className="text-primary"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
          />

          {/* Pulsing effect after opening */}
          <motion.g
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          >
            <circle cx="60" cy="45" r="3" fill="currentColor" className="text-primary" opacity="0" />
          </motion.g>
        </svg>

        {/* Loading text */}
        <motion.p
          className="text-center mt-6 text-muted-foreground font-medium text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}