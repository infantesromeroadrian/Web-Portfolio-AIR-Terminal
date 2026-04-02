/**
 * Panel de login — Landing page que impresiona.
 *
 * Efectos:
 *  - Split text: cada letra del nombre entra con flip 3D + blur
 *  - Scramble decode: el rol se "desencripta" de caracteres random
 *  - Magnetic button: el CTA se mueve sutilmente hacia el cursor
 *  - Glitch alias: L4tentNoise tiene glitch on hover
 *  - Staggered CSS para badges y métricas
 *  - GSAP exit solo para la transición a terminal
 */

import { useEffect, useRef } from "preact/hooks";
import gsap from "gsap";

/* ── Split Text ─────────────────────────────────────────────── */

function SplitText({
  text,
  baseDelay,
  className,
}: {
  text: string;
  baseDelay: number;
  className?: string;
}) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={i}
          class={`animate-letter-in ${className ?? ""}`}
          style={{ animationDelay: `${baseDelay + i * 35}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

/* ── Scramble Decode Text ───────────────────────────────────── */

function ScrambleText({ text, delay }: { text: string; delay: number }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    el.textContent = "";

    const chars = "!<>-_\\/[]{}—=+*^?#@$%&01";
    let frame: number;
    let iteration = 0;

    const timer = setTimeout(() => {
      const animate = (): void => {
        el.textContent = text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "|") return char;
            if (i < iteration) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        iteration += 0.5;

        if (iteration < text.length) {
          frame = requestAnimationFrame(animate);
        } else {
          el.textContent = text;
        }
      };
      frame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [text, delay]);

  return <span ref={spanRef} />;
}

/* ── Magnetic Button ────────────────────────────────────────── */

function MagneticButton({
  children,
  onClick,
  className,
  style,
}: {
  children: preact.ComponentChildren;
  onClick: () => void;
  className: string;
  style: Record<string, string>;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent): void => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
  };

  const handleMouseLeave = (): void => {
    if (btnRef.current) {
      btnRef.current.style.transform = "translate(0, 0)";
    }
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      class={`magnetic-btn ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

/* ── Login Panel ────────────────────────────────────────────── */

export default function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const exitingRef = useRef(false);

  const handleLogin = (): void => {
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
      <div class="text-center" style={{ perspective: "800px" }}>
        {/* Split text name — each letter flips in from below */}
        <h1 class="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-1">
          <span class="text-gradient">
            <SplitText text="Adrian" baseDelay={50} />
            {"\u00A0"}
            <SplitText text="Infantes" baseDelay={200} />
          </span>
        </h1>

        {/* Alias with glitch on hover */}
        <p
          class="font-mono text-sm sm:text-base tracking-widest mb-4 text-[var(--cyan-bright)] opacity-0 animate-fade-slide-up glitch-subtle"
          style={{ animationDelay: "350ms" }}
          data-text="aka L4tentNoise"
        >
          <span class="text-[var(--text-muted)]">aka</span> L4tentNoise
        </p>

        {/* Role — scramble decode effect */}
        <p
          class="text-[var(--text-secondary)] text-lg sm:text-xl mb-4 opacity-0 animate-fade-slide-up"
          style={{ animationDelay: "450ms" }}
        >
          <ScrambleText text="AI Red Teamer | ML Security Engineer" delay={550} />
        </p>

        {/* Badges with stagger */}
        <div class="flex items-center justify-center gap-3 mb-7 flex-wrap">
          {["Prompt Injection", "Agent Security", "Adversarial ML", "LLM Defense"].map(
            (label, i) => (
              <span
                key={label}
                class={`badge badge-${["red", "coral", "blue", "cyan"][i]} opacity-0 animate-fade-slide-up`}
                style={{ animationDelay: `${550 + i * 60}ms` }}
              >
                {label}
              </span>
            )
          )}
        </div>

        {/* Tagline */}
        <p
          class="text-[var(--text-muted)] mb-5 font-mono text-sm max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-slide-up"
          style={{ animationDelay: "800ms" }}
        >
          <span class="text-[var(--coral-bright)]">→</span> I break and harden AI systems before
          attackers do. Specialized in prompt injection, agent security, adversarial evaluation, and
          secure GenAI.
        </p>

        {/* Key metrics */}
        <div class="flex items-center justify-center gap-4 sm:gap-6 mb-8 font-mono text-xs flex-wrap">
          {[
            { color: "var(--coral-bright)", text: "BBVA Financial Intelligence" },
            { color: "var(--cyan-bright)", text: "HTB Global #871" },
            { color: "var(--blue-soft)", text: "12 Machines · 41 Flags" },
          ].map((metric, i) => (
            <span
              key={metric.text}
              class="flex items-center gap-1.5 text-[var(--text-secondary)] opacity-0 animate-fade-slide-up"
              style={{ animationDelay: `${900 + i * 60}ms` }}
            >
              <span style={{ color: metric.color }}>■</span> {metric.text}
            </span>
          ))}
        </div>

        {/* Magnetic CTA button */}
        <div class="opacity-0 animate-fade-slide-up" style={{ animationDelay: "1100ms" }}>
          <MagneticButton
            onClick={handleLogin}
            className="px-10 py-4 rounded-xl font-display font-semibold text-lg btn-cta btn-press focus-ring"
            style={{
              background: "linear-gradient(135deg, var(--coral-bright) 0%, var(--coral-mid) 100%)",
              color: "white",
              boxShadow: "0 4px 30px rgba(255, 77, 77, 0.4)",
            }}
          >
            Review My Work →
          </MagneticButton>
        </div>

        <p
          class="text-[var(--text-muted)] text-xs font-mono mt-5 opacity-0 animate-fade-slide-up"
          style={{ animationDelay: "1200ms" }}
        >
          Start with whoami, proyectos, or classify
        </p>
      </div>

      {/* Character video */}
      <div
        class="relative mt-6 opacity-0 animate-fade-slide-up"
        style={{ animationDelay: "600ms" }}
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
          style={{ filter: "drop-shadow(0 0 18px rgba(255, 77, 77, 0.18))" }}
        >
          <source src={`${import.meta.env.BASE_URL}character-intro.webm`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}character-intro.mp4`} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
