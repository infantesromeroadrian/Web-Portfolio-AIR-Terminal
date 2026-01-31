/**
 * Panel de login inicial - Con personaje animado caminando.
 *
 * Este componente muestra:
 *  - Personaje caminando (GIF animado)
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
    <div class="w-full max-w-2xl px-4 relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
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

        {/* GIF del personaje */}
        <img
          src={`${import.meta.env.BASE_URL}character-walk.gif`}
          alt="Adrian Infantes - AI Security Architect"
          class="relative w-64 h-auto sm:w-80 md:w-96 max-w-full"
          style={{
            filter: "drop-shadow(0 0 40px rgba(255, 77, 77, 0.3))",
          }}
        />
      </div>

      {/* Contenido que aparece */}
      <div
        class={`text-center transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* Nombre con tipografía display */}
        <h1 class="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-3">
          <span class="text-gradient">Adrian Infantes</span>
        </h1>

        {/* Rol */}
        <p class="text-[var(--text-secondary)] text-lg sm:text-xl mb-6">AI Security Architect</p>

        {/* Badges */}
        <div class="flex items-center justify-center gap-3 mb-8 flex-wrap">
          <span class="badge badge-coral">LLM Security</span>
          <span class="badge badge-cyan">Blue Team</span>
          <span class="badge badge-blue">ML Engineering</span>
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
      </div>

      {/* Indicador de conexión */}
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[var(--cyan-bright)] animate-pulse"></span>
        <span class="text-xs font-mono text-[var(--text-muted)]">Secure connection</span>
      </div>
    </div>
  );
}
