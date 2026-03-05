/**
 * Panel de login inicial - Con personaje animado caminando.
 *
 * Este componente muestra:
 *  - Personaje con capucha (video WebM 2.5MB / MP4 5.6MB fallback)
 *  - Nombre y rol
 *  - Botón para entrar a la terminal
 *
 * Diseño: Minimalista, centrado en el personaje.
 */

import { useEffect, useState } from "preact/hooks";

export default function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const [showContent, setShowContent] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Mostrar contenido después de que el GIF cargue un poco
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    // Auto-entrar después de 4 segundos (opcional)
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  return (
    <div class="w-full max-w-5xl px-4 relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Personaje caminando */}
      <div class="relative mb-8 animate-fade-in">
        {/* Glow detrás del personaje */}
        <div
          class="absolute inset-0 blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--coral-bright) 0%, transparent 70%)",
            transform: "scale(1.5)",
          }}
        />

        {/* Video del personaje (WebM + MP4 fallback) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          class="relative w-[36rem] h-auto sm:w-[48rem] md:w-[60rem] max-w-full"
          style={{
            filter: "drop-shadow(0 0 40px rgba(255, 77, 77, 0.3))",
          }}
        >
          <source src={`${import.meta.env.BASE_URL}character-intro.webm`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}character-intro.mp4`} type="video/mp4" />
        </video>
      </div>

      {/* Contenido que aparece */}
      <div
        class={`text-center transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* Nombre con tipografía display */}
        <h1 class="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-1">
          <span class="text-gradient">Adrian Infantes</span>
        </h1>

        {/* Alias HTB */}
        <p class="font-mono text-sm sm:text-base tracking-widest mb-4 text-[var(--cyan-bright)] opacity-70">
          <span class="text-[var(--text-muted)]">aka</span> L4tentNoise
        </p>

        {/* Rol */}
        <p class="text-[var(--text-secondary)] text-lg sm:text-xl mb-6">AI Security Architect</p>

        {/* Badges */}
        <div class="flex items-center justify-center gap-3 mb-8 flex-wrap">
          <span class="badge badge-coral">LLM Security</span>
          <span class="badge badge-blue">Blue Team</span>
          <span class="badge badge-cyan">ML Engineering</span>
          <span class="badge badge-red">AI Red Teaming</span>
        </div>

        {/* Tagline */}
        <p class="text-[var(--text-muted)] mb-10 font-mono text-sm max-w-md mx-auto">
          <span class="text-[var(--coral-bright)]">→</span> Protecting AI systems from emerging
          threats
        </p>

        {/* Botón de entrada */}
        <button
          type="button"
          onClick={onLogin}
          class={`px-10 py-4 rounded-xl font-display font-semibold text-lg transition-all duration-500 btn-press focus-ring ${isReady ? "animate-pulse-soft" : ""}`}
          style={{
            background: "linear-gradient(135deg, var(--coral-bright) 0%, var(--coral-mid) 100%)",
            color: "white",
            boxShadow: "0 4px 30px rgba(255, 77, 77, 0.4)",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.boxShadow = "0 8px 40px rgba(255, 77, 77, 0.6)";
            (e.target as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.02)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.boxShadow = "0 4px 30px rgba(255, 77, 77, 0.4)";
            (e.target as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
          }}
        >
          Enter Terminal →
        </button>

        {/* Hint */}
        <p class="text-[var(--text-muted)] text-xs font-mono mt-6 animate-pulse-soft">
          Click to explore my portfolio
        </p>

        {/* Indicador de conexión - integrado en el flujo */}
        <div class="flex items-center justify-center gap-2 mt-8">
          <span class="w-2 h-2 rounded-full bg-[var(--cyan-bright)] animate-pulse"></span>
          <span class="text-xs font-mono text-[var(--text-muted)]">Secure connection</span>
        </div>
      </div>
    </div>
  );
}
