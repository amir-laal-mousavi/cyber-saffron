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

        {/* Simplified Saffron Glyph Icon */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="relative z-10"
        >
          {/* Center stigma threads - simplified as 3 lines */}
          <motion.g
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <line x1="60" y1="60" x2="60" y2="35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary" />
            <line x1="60" y1="60" x2="52" y2="37" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary" />
            <line x1="60" y1="60" x2="68" y2="37" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary" />
          </motion.g>

          {/* Simplified petals - 6 petal shapes in circular pattern */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const x = 60 + Math.cos(angle) * 28;
            const y = 60 + Math.sin(angle) * 28;
            
            return (
              <motion.ellipse
                key={i}
                cx={x}
                cy={y}
                rx="12"
                ry="20"
                fill="currentColor"
                className="text-secondary"
                opacity="0.8"
                transform={`rotate(${i * 60} ${x} ${y})`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0.85, 1, 0.85],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            );
          })}

          {/* Center dot */}
          <motion.circle
            cx="60"
            cy="60"
            r="6"
            fill="currentColor"
            className="text-primary"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Loading text */}
        <motion.p
          className="text-center mt-6 text-muted-foreground font-medium text-sm"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}