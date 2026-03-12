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

  useEffect(() => {
    // Mostrar contenido después de que el GIF cargue un poco
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    return () => {
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div class="w-full max-w-5xl px-4 relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Contenido principal — globo 3D visible detrás */}
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
        <p class="text-[var(--text-secondary)] text-lg sm:text-xl mb-4">
          AI Red Teamer | ML Security Engineer
        </p>

        {/* Badges */}
        <div class="flex items-center justify-center gap-3 mb-7 flex-wrap">
          <span class="badge badge-red">Prompt Injection</span>
          <span class="badge badge-coral">Agent Security</span>
          <span class="badge badge-blue">Adversarial ML</span>
          <span class="badge badge-cyan">LLM Defense</span>
        </div>

        {/* Tagline */}
        <p class="text-[var(--text-muted)] mb-8 font-mono text-sm max-w-2xl mx-auto leading-relaxed">
          <span class="text-[var(--coral-bright)]">→</span> I break and harden AI systems before
          attackers do. Specialized in prompt injection, agent security, adversarial evaluation, and
          secure GenAI.
        </p>

        {/* Botón de entrada */}
        <button
          type="button"
          onClick={onLogin}
          class="px-10 py-4 rounded-xl font-display font-semibold text-lg transition-all duration-500 btn-press focus-ring"
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
          Review My Work →
        </button>

        {/* Hint */}
        <p class="text-[var(--text-muted)] text-xs font-mono mt-5">
          Start with whoami, proyectos, or classify
        </p>
      </div>

      {/* Personaje caminando — debajo del botón */}
      <div class="relative mt-6 animate-fade-in">
        {/* Glow detrás del personaje */}
        <div
          class="absolute inset-0 blur-3xl opacity-30"
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
          class="relative w-[24rem] h-auto sm:w-[30rem] md:w-[38rem] max-w-full opacity-90"
          style={{
            filter: "drop-shadow(0 0 18px rgba(255, 77, 77, 0.18))",
          }}
        >
          <source src={`${import.meta.env.BASE_URL}character-intro.webm`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}character-intro.mp4`} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
