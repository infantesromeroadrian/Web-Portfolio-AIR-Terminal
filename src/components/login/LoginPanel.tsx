/**
 * Panel de login inicial - Rediseño estilo OpenClaw.
 *
 * Este componente simula un proceso de autenticación estilo terminal:
 *  - Escribe automáticamente un usuario y contraseña ficticios
 *  - Tras completar la animación, llama a onLogin() para entrar en la terminal
 *
 * Diseño: Tipografía premium, gradientes coral/cyan, glassmorphism moderno.
 */

import { useEffect, useState } from "preact/hooks";

export default function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const [userText, setUserText] = useState("");
  const [passText, setPassText] = useState("");
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const user = "air";
    const pass = "**************";

    let userInterval: number | undefined;
    let passInterval: number | undefined;

    const timeout = setTimeout(() => {
      let i = 0;

      userInterval = setInterval(() => {
        setUserText(user.slice(0, i));
        i++;

        if (i > user.length) {
          clearInterval(userInterval);

          let j = 0;

          passInterval = setInterval(() => {
            setPassText(pass.slice(0, j));
            j++;

            if (j > pass.length) {
              clearInterval(passInterval);
              setIsAnimating(false);
              setTimeout(() => {
                onLogin();
              }, 400);
            }
          }, 80);
        }
      }, 80);
    }, 500);

    return () => {
      clearTimeout(timeout);
      clearInterval(userInterval);
      clearInterval(passInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div class="w-full max-w-lg px-4 relative z-10 animate-slide-up">
      {/* Card principal con glassmorphism */}
      <div class="glass-panel rounded-2xl overflow-hidden border-top-gradient">
        {/* Header con botones macOS */}
        <div class="bg-[var(--bg-elevated)]/50 px-6 py-4 flex items-center border-b border-[var(--border-subtle)]">
          <div class="flex space-x-2">
            <div class="w-3 h-3 rounded-full bg-[var(--macos-red)] shadow-[0_0_6px_var(--macos-red)] transition-transform hover:scale-110"></div>
            <div class="w-3 h-3 rounded-full bg-[var(--macos-yellow)] shadow-[0_0_6px_var(--macos-yellow)] transition-transform hover:scale-110"></div>
            <div class="w-3 h-3 rounded-full bg-[var(--macos-green)] shadow-[0_0_6px_var(--macos-green)] transition-transform hover:scale-110"></div>
          </div>
          <span class="flex-1 text-center text-[var(--text-muted)] font-mono text-sm">
            secure_access.sh
          </span>
        </div>

        {/* Contenido principal */}
        <div class="p-8 sm:p-10">
          {/* Logo con efecto glow */}
          <div class="flex justify-center mb-8">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-[var(--coral-bright)] to-[var(--cyan-bright)] rounded-2xl blur-xl opacity-30 animate-pulse-soft"></div>
              <img
                src={`${import.meta.env.BASE_URL}favicon.png`}
                alt="AIR Security Logo"
                class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-[var(--border-subtle)]"
                style="filter: drop-shadow(0 0 30px rgba(255, 77, 77, 0.3));"
              />
            </div>
          </div>

          {/* Título con tipografía display */}
          <div class="mb-8 text-center">
            <h1 class="font-display text-3xl sm:text-4xl font-bold mb-3">
              <span class="text-gradient">Adrian Infantes</span>
            </h1>
            <p class="text-[var(--text-secondary)] text-base sm:text-lg">AI Security Architect</p>
            <div class="flex items-center justify-center gap-2 mt-4">
              <span class="badge badge-coral">LLM Security</span>
              <span class="badge badge-cyan">Blue Team</span>
            </div>
          </div>

          {/* Tagline estilo OpenClaw */}
          <p class="text-center text-[var(--text-muted)] mb-8 font-mono text-sm">
            <span class="text-[var(--coral-bright)]">→</span> Protecting AI systems from emerging
            threats
          </p>

          {/* Formulario visual */}
          <form
            class="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
          >
            {/* Usuario */}
            <div class="space-y-2">
              <label class="block text-[var(--text-secondary)] font-mono text-sm">
                <span class="text-[var(--coral-bright)]">$</span> user
              </label>
              <input
                type="text"
                class="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-3.5 text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--coral-bright)] focus:ring-2 focus:ring-[var(--coral-bright)]/20 transition-all duration-300"
                value={userText}
                readOnly
                placeholder="authenticating..."
              />
            </div>

            {/* Contraseña */}
            <div class="space-y-2">
              <label class="block text-[var(--text-secondary)] font-mono text-sm">
                <span class="text-[var(--coral-bright)]">$</span> password
              </label>
              <input
                type="password"
                class="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg px-4 py-3.5 text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--coral-bright)] focus:ring-2 focus:ring-[var(--coral-bright)]/20 transition-all duration-300"
                value={passText}
                readOnly
                placeholder="••••••••••••"
              />
            </div>

            {/* Botón principal con gradiente */}
            <button
              type="button"
              onClick={onLogin}
              class="w-full mt-6 py-4 px-6 rounded-xl font-display font-semibold text-base transition-all duration-300 btn-press focus-ring"
              style={{
                background:
                  "linear-gradient(135deg, var(--coral-bright) 0%, var(--coral-mid) 100%)",
                color: "white",
                boxShadow: "0 4px 20px rgba(255, 77, 77, 0.3)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.boxShadow =
                  "0 6px 30px rgba(255, 77, 77, 0.5)";
                (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.boxShadow =
                  "0 4px 20px rgba(255, 77, 77, 0.3)";
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              {isAnimating ? "Skip Intro →" : "Enter Terminal →"}
            </button>

            {/* Indicador durante animación */}
            {isAnimating && (
              <p class="text-center text-[var(--text-muted)] text-xs font-mono mt-4 animate-pulse-soft">
                Authenticating<span class="loading-dots"></span>
              </p>
            )}
          </form>
        </div>

        {/* Footer del panel */}
        <div class="px-8 py-4 bg-[var(--bg-elevated)]/30 border-t border-[var(--border-subtle)]">
          <p class="text-center text-[var(--text-muted)] text-xs font-mono">
            <span class="text-[var(--cyan-bright)]">●</span> Secure connection established
          </p>
        </div>
      </div>
    </div>
  );
}
