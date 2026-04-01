/**
 * Panel de login inicial - Con globo 3D de fondo.
 *
 * Este componente muestra:
 *  - Nombre y rol con GSAP entrance animation
 *  - Badges de especialización
 *  - Botón CTA con CSS hover (sin inline JS)
 *  - GSAP exit transition antes de navegar a terminal
 *
 * Transiciones: GSAP para entrada y salida coordinadas.
 */

import { useEffect, useRef } from "preact/hooks";
import gsap from "gsap";

export default function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const exitingRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Set initial hidden state via GSAP (not CSS, so elements are visible if GSAP fails)
    const allTargets = [
      el.querySelector(".login-title"),
      el.querySelector(".login-alias"),
      el.querySelector(".login-role"),
      ...el.querySelectorAll(".login-badges .badge"),
      el.querySelector(".login-tagline"),
      ...el.querySelectorAll(".login-metrics > span"),
      el.querySelector(".login-cta"),
      el.querySelector(".login-hint"),
    ].filter(Boolean);

    gsap.set(allTargets, { opacity: 0, y: 15 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(el.querySelector(".login-title"), { opacity: 1, y: 0, scale: 1, duration: 0.7 })
      .to(el.querySelector(".login-alias"), { opacity: 1, y: 0, duration: 0.4 }, "-=0.35")
      .to(el.querySelector(".login-role"), { opacity: 1, y: 0, duration: 0.4 }, "-=0.25")
      .to(
        el.querySelectorAll(".login-badges .badge"),
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
          stagger: { each: 0.06, from: "center" },
        },
        "-=0.2"
      )
      .to(el.querySelector(".login-tagline"), { opacity: 1, y: 0, duration: 0.4 }, "-=0.15")
      .to(
        el.querySelectorAll(".login-metrics > span"),
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 },
        "-=0.1"
      )
      .to(
        el.querySelector(".login-cta"),
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" },
        "-=0.2"
      )
      .to(el.querySelector(".login-hint"), { opacity: 1, duration: 0.3 }, "-=0.1");

    // No cleanup — let timeline complete naturally
  }, []);

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
        <h1 class="login-title font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-1">
          <span class="text-gradient">Adrian Infantes</span>
        </h1>

        <p class="login-alias font-mono text-sm sm:text-base tracking-widest mb-4 text-[var(--cyan-bright)] opacity-70">
          <span class="text-[var(--text-muted)]">aka</span> L4tentNoise
        </p>

        <p class="login-role text-[var(--text-secondary)] text-lg sm:text-xl mb-4">
          AI Red Teamer | ML Security Engineer
        </p>

        <div class="login-badges flex items-center justify-center gap-3 mb-7 flex-wrap">
          <span class="badge badge-red">Prompt Injection</span>
          <span class="badge badge-coral">Agent Security</span>
          <span class="badge badge-blue">Adversarial ML</span>
          <span class="badge badge-cyan">LLM Defense</span>
        </div>

        <p class="login-tagline text-[var(--text-muted)] mb-5 font-mono text-sm max-w-2xl mx-auto leading-relaxed">
          <span class="text-[var(--coral-bright)]">→</span> I break and harden AI systems before
          attackers do. Specialized in prompt injection, agent security, adversarial evaluation, and
          secure GenAI.
        </p>

        {/* Key metrics — what recruiters need to see in 5 seconds */}
        <div class="login-metrics flex items-center justify-center gap-4 sm:gap-6 mb-8 font-mono text-xs flex-wrap">
          <span class="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span class="text-[var(--coral-bright)]">■</span> BBVA Financial Intelligence
          </span>
          <span class="hidden sm:inline text-[var(--border-subtle)]">|</span>
          <span class="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span class="text-[var(--cyan-bright)]">■</span> HTB Global #871
          </span>
          <span class="hidden sm:inline text-[var(--border-subtle)]">|</span>
          <span class="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span class="text-[var(--blue-soft)]">■</span> 12 Machines · 41 Flags
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          class="login-cta px-10 py-4 rounded-xl font-display font-semibold text-lg btn-cta btn-press focus-ring"
          style={{
            background: "linear-gradient(135deg, var(--coral-bright) 0%, var(--coral-mid) 100%)",
            color: "white",
            boxShadow: "0 4px 30px rgba(255, 77, 77, 0.4)",
          }}
        >
          Review My Work →
        </button>

        <p class="login-hint text-[var(--text-muted)] text-xs font-mono mt-5">
          Start with whoami, proyectos, or classify
        </p>
      </div>

      <div class="relative mt-6">
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
