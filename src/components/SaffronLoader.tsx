import { motion } from "framer-motion";

export function SaffronLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Saffron flower petals */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="relative z-10"
        >
          {/* Center stigma (the valuable saffron threads) */}
          <motion.g
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <line x1="100" y1="100" x2="100" y2="70" stroke="#FF4500" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="100" x2="95" y2="72" stroke="#FF4500" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="100" x2="105" y2="72" stroke="#FF4500" strokeWidth="3" strokeLinecap="round" />
          </motion.g>

          {/* Petals - 6 petals in a circular pattern */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const x = 100 + Math.cos(angle) * 40;
            const y = 100 + Math.sin(angle) * 40;
            
            return (
              <motion.ellipse
                key={i}
                cx={x}
                cy={y}
                rx="25"
                ry="35"
                fill="url(#petalGradient)"
                transform={`rotate(${i * 60} ${x} ${y})`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0.8, 1, 0.8],
                  opacity: [0.7, 1, 0.7],
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

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="petalGradient">
              <stop offset="0%" stopColor="#E6B3FF" />
              <stop offset="50%" stopColor="#B366FF" />
              <stop offset="100%" stopColor="#8000FF" />
            </radialGradient>
          </defs>
        </svg>

        {/* Pulsing center glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255, 69, 0, 0.6) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Loading text */}
        <motion.p
          className="text-center mt-8 text-muted-foreground font-medium"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading dashboard...
        </motion.p>
      </div>
    </div>
  );
}
