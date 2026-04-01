/**
 * Panel de login inicial - Con globo 3D de fondo.
 *
 * Entrance: CSS keyframe animations with staggered delays (reliable in Preact).
 * Exit: GSAP for smooth coordinated fade-out before navigating to terminal.
 */

import { useRef } from "preact/hooks";
import gsap from "gsap";

export default function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const exitingRef = useRef(false);

  const handleLogin = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;

    if (!containerRef.current) {
      onLogin();
      return;
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      y: -30,
      scale: 0.98,
      duration: 0.45,
      ease: "power2.in",
      onComplete: onLogin,
    });
  };

  return (
    <div
      ref={containerRef}
      class="w-full max-w-5xl px-4 relative z-10 flex flex-col items-center justify-center min-h-[70vh]"
    >
      <div class="text-center">
        <h1
          class="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-1 animate-fade-slide-up"
          style={{ animationDelay: "0ms" }}
        >
          <span class="text-gradient">Adrian Infantes</span>
        </h1>

        <p
          class="font-mono text-sm sm:text-base tracking-widest mb-4 text-[var(--cyan-bright)] opacity-0 animate-fade-slide-up"
          style={{ animationDelay: "120ms" }}
        >
          <span class="text-[var(--text-muted)]">aka</span> L4tentNoise
        </p>

        <p
          class="text-[var(--text-secondary)] text-lg sm:text-xl mb-4 opacity-0 animate-fade-slide-up"
          style={{ animationDelay: "220ms" }}
        >
          AI Red Teamer | ML Security Engineer
        </p>

        <div class="flex items-center justify-center gap-3 mb-7 flex-wrap">
          <span
            class="badge badge-red opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "320ms" }}
          >
            Prompt Injection
          </span>
          <span
            class="badge badge-coral opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "380ms" }}
          >
            Agent Security
          </span>
          <span
            class="badge badge-blue opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "440ms" }}
          >
            Adversarial ML
          </span>
          <span
            class="badge badge-cyan opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            LLM Defense
          </span>
        </div>

        <p
          class="text-[var(--text-muted)] mb-5 font-mono text-sm max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-slide-up"
          style={{ animationDelay: "560ms" }}
        >
          <span class="text-[var(--coral-bright)]">→</span> I break and harden AI systems before
          attackers do. Specialized in prompt injection, agent security, adversarial evaluation, and
          secure GenAI.
        </p>

        {/* Key metrics — what recruiters need to see in 5 seconds */}
        <div class="flex items-center justify-center gap-4 sm:gap-6 mb-8 font-mono text-xs flex-wrap">
          <span
            class="flex items-center gap-1.5 text-[var(--text-secondary)] opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "640ms" }}
          >
            <span class="text-[var(--coral-bright)]">■</span> BBVA Financial Intelligence
          </span>
          <span
            class="hidden sm:inline text-[var(--border-subtle)] opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "680ms" }}
          >
            |
          </span>
          <span
            class="flex items-center gap-1.5 text-[var(--text-secondary)] opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "720ms" }}
          >
            <span class="text-[var(--cyan-bright)]">■</span> HTB Global #871
          </span>
          <span
            class="hidden sm:inline text-[var(--border-subtle)] opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "760ms" }}
          >
            |
          </span>
          <span
            class="flex items-center gap-1.5 text-[var(--text-secondary)] opacity-0 animate-fade-slide-up"
            style={{ animationDelay: "800ms" }}
          >
            <span class="text-[var(--blue-soft)]">■</span> 12 Machines · 41 Flags
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          class="px-10 py-4 rounded-xl font-display font-semibold text-lg btn-cta btn-press focus-ring opacity-0 animate-fade-slide-up"
          style={{
            animationDelay: "880ms",
            background: "linear-gradient(135deg, var(--coral-bright) 0%, var(--coral-mid) 100%)",
            color: "white",
            boxShadow: "0 4px 30px rgba(255, 77, 77, 0.4)",
          }}
        >
          Review My Work →
        </button>

        <p
          class="text-[var(--text-muted)] text-xs font-mono mt-5 opacity-0 animate-fade-slide-up"
          style={{ animationDelay: "960ms" }}
        >
          Start with whoami, proyectos, or classify
        </p>
      </div>

      <div
        class="relative mt-6 opacity-0 animate-fade-slide-up"
        style={{ animationDelay: "400ms" }}
      >
        <div
          class="absolute inset-0 blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--coral-bright) 0%, transparent 70%)",
            transform: "scale(1.5)",
          }}
        />

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
