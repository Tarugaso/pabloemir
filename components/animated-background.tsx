"use client"

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fondo degradado oscuro sofisticado */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
      </div>

      {/* Elementos geométricos flotantes */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`geometric-${i}`}
            className="absolute animate-float-geometric opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            <div
              className="w-8 h-8 border border-white/30 rotate-45 backdrop-blur-sm"
              style={{
                background: `linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))`,
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Círculos abstractos */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={`circle-${i}`}
            className="absolute rounded-full animate-pulse-slow opacity-10"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              width: `${60 + Math.random() * 40}px`,
              height: `${60 + Math.random() * 40}px`,
              background: `radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent)`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Líneas conectoras animadas */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute animate-draw-line opacity-20"
            style={{
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              width: `${100 + Math.random() * 100}px`,
              height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${i * 1.2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Partículas flotantes minimalistas */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Efectos de luz sutil */}
      <div className="absolute inset-0">
        <div
          className="absolute w-96 h-96 rounded-full opacity-5 animate-pulse-glow"
          style={{
            left: "10%",
            top: "20%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%)",
          }}
        ></div>
        <div
          className="absolute w-80 h-80 rounded-full opacity-5 animate-pulse-glow"
          style={{
            right: "15%",
            bottom: "25%",
            background: "radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent 70%)",
            animationDelay: "2s",
          }}
        ></div>
      </div>
    </div>
  )
}
