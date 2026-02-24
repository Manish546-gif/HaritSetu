import { useEffect, useState } from "react";
import { Sprout, Wind, Leaf, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

/**
 * LoadingScreen - Failsafe Premium 2D Version
 * Bypasses Three.js reconciler issues while maintaining a high-end aesthetic.
 */
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    "Initializing HaritSetu...",
    "Connecting to Carbon Ledger...",
    "Verifying Sustainable Practices...",
    "Optimizing Ecosystem Data...",
    "Ready to Grow."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() * 3 + 1);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 800);
          }, 600);
          return 100;
        }
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    setActiveStage(Math.floor((progress / 100) * stages.length));
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center transition-all duration-1000 ${fadeOut ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
        }`}
      style={{
        background: "linear-gradient(135deg, #f1f8e9 0%, #c8e6c9 50%, #dcedc8 100%)",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-lime-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Central Visual */}
      <div className="relative mb-12 flex flex-col items-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Pulsing Rings */}
          <div className="absolute inset-0 border-4 border-green-500/20 rounded-full animate-ping" />
          <div className="absolute inset-4 border-2 border-green-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Main Icon with Growth Effect */}
          <div className="relative z-10 w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-3xl" />
            <Leaf
              className="w-12 h-12 text-green-600 transition-transform duration-500"
              style={{ transform: `scale(${0.8 + (progress / 100) * 0.4}) rotate(${progress * 1.8}deg)` }}
            />
          </div>

          {/* Orbiting Icons */}
          {[Zap, ShieldCheck, CheckCircle2].map((Icon, i) => (
            <div
              key={i}
              className="absolute w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center animate-float"
              style={{
                top: `${50 + 45 * Math.sin((Date.now() / 1000) + i * 2)}%`,
                left: `${50 + 45 * Math.cos((Date.now() / 1000) + i * 2)}%`,
                animationDelay: `${i * 0.5}s`,
                opacity: progress > (i + 1) * 25 ? 1 : 0,
                transition: 'opacity 0.5s ease-out'
              }}
            >
              <Icon className="w-5 h-5 text-green-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Text Branding */}
      <div className="text-center z-10 px-6">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-green-900 drop-shadow-sm mb-2">
          HaritSetu
        </h1>
        <div className="flex items-center justify-center gap-3 text-green-700 font-bold tracking-[0.2em] uppercase text-xs">
          <Sprout className="w-4 h-4 animate-bounce" />
          <span>Eco-Friendly Carbon Ledger🌿</span>
          <Wind className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      {/* Progress System */}
      <div className="w-full max-w-xs mt-12 px-4 z-10">
        <div className="relative h-2.5 bg-green-900/10 rounded-full overflow-hidden backdrop-blur-md border border-white/40">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #1b5e20 0%, #388e3c 50%, #66bb6a 100%)",
              boxShadow: "0 0 15px rgba(27,94,32,0.3)",
            }}
          />
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex flex-col">
            <span className="text-green-800 text-[9px] font-black uppercase tracking-widest opacity-40">
              System Status
            </span>
            <span className="text-green-900 text-xs font-bold transition-all duration-500 h-4 overflow-hidden">
              {stages[Math.min(activeStage, stages.length - 1)]}
            </span>
          </div>
          <span className="text-green-900 text-2xl font-black tabular-nums">
            {Math.floor(progress)}<span className="text-sm opacity-50 ml-0.5">%</span>
          </span>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="absolute bottom-10 text-green-800/40 text-[10px] uppercase font-bold tracking-[0.4em]">
        Cultivating a greener future
      </div>
    </div>
  );
};

export default LoadingScreen;
