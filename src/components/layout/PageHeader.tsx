/**
 * Header principal - Responsive navigation.
 *
 * Este componente:
 *  - Desktop (lg+): navbar horizontal con todos los items visibles
 *  - Mobile/Tablet (< lg): menú hamburguesa desplegable
 *  - Logo SVG con identidad visual
 *
 * Diseño: Glassmorphism, tipografía display, transiciones suaves.
 */

import { useState } from "preact/hooks";
import { NAV_ITEMS } from "../../core/navItems";

/**
 * Logo - Imagen del cerebro con escudo
 */
function LogoIcon({ isL4tentMode }: { isL4tentMode: boolean }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });

  const handleMouseMove = (e: MouseEvent) => {
    const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const offsetX = (e.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (e.clientY - bounds.top) / bounds.height - 0.5;

    setTilt({
      rotateX: Number((-offsetY * 12).toFixed(2)),
      rotateY: Number((offsetX * 14).toFixed(2)),
      glowX: Math.round((offsetX + 0.5) * 100),
      glowY: Math.round((offsetY + 0.5) * 100),
    });
  };

  const resetTilt = () => {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  };

  return (
    <div
      class={isL4tentMode ? "l4tent-logo-glitch" : ""}
      style={{ perspective: "900px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      <div
        class="relative rounded-2xl transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          class={`absolute inset-0 rounded-2xl ${
            isL4tentMode
              ? "border border-[rgba(255,0,51,0.4)]"
              : "border border-[rgba(96,165,250,0.24)]"
          }`}
          style={{
            transform: "translateZ(-10px) scale(0.94)",
            background: isL4tentMode
              ? "linear-gradient(135deg, rgba(255,0,51,0.18), rgba(17,24,39,0.85))"
              : "linear-gradient(135deg, rgba(34,211,238,0.16), rgba(15,23,42,0.9))",
            boxShadow: isL4tentMode
              ? "0 16px 28px rgba(255,0,51,0.18)"
              : "0 16px 28px rgba(15,23,42,0.4)",
          }}
        />

        <div
          class="absolute inset-0 rounded-2xl"
          style={{
            transform: "translateZ(14px)",
            background: isL4tentMode
              ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255,0,51,0.32), transparent 58%)`
              : `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(34,211,238,0.24), transparent 58%)`,
            opacity: 0.95,
          }}
        />

        <img
          src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
          alt="Portfolio Logo"
          class={`relative w-10 h-10 sm:w-12 sm:h-12 object-contain ${
            isL4tentMode
              ? "drop-shadow-[0_0_16px_rgba(255,0,51,0.65)]"
              : "drop-shadow-[0_10px_18px_rgba(15,23,42,0.45)]"
          }`}
          style={{
            transform: "translateZ(26px)",
            filter: isL4tentMode
              ? "drop-shadow(0 0 14px rgba(255,0,51,0.7))"
              : "drop-shadow(0 0 10px rgba(34,211,238,0.22))",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Icono hamburguesa animado
 */
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div class="w-6 h-5 relative flex flex-col justify-between">
      <span
        class={`block h-0.5 w-full bg-[var(--text-primary)] rounded transition-all duration-300 origin-center ${
          isOpen ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        class={`block h-0.5 w-full bg-[var(--text-primary)] rounded transition-all duration-300 ${
          isOpen ? "opacity-0 scale-0" : ""
        }`}
      />
      <span
        class={`block h-0.5 w-full bg-[var(--text-primary)] rounded transition-all duration-300 origin-center ${
          isOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </div>
  );
}

interface PageHeaderProps {
  runCommand: (cmd: string) => Promise<void>;
  isL4tentMode?: boolean;
}

export default function PageHeader({ runCommand, isL4tentMode = false }: PageHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCommand = (cmd: string) => {
    setIsMenuOpen(false);
    void runCommand(cmd);
  };

  return (
    <>
      <header class="w-full glass-panel border-b border-[var(--border-subtle)] fixed top-0 left-0 z-50">
        <nav
          class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          {/* Logo y nombre */}
          <div class="flex items-center gap-3 flex-shrink-0">
            <LogoIcon isL4tentMode={isL4tentMode} />
            <div class="hidden sm:block">
              {isL4tentMode ? (
                <span class="font-mono font-bold text-lg text-[var(--coral-bright)] glitch tracking-wider">
                  L4tentNoise
                </span>
              ) : (
                <>
                  <span class="font-display font-semibold text-lg text-[var(--text-primary)]">
                    Adrian
                  </span>
                  <span class="font-display font-semibold text-lg text-[var(--coral-bright)] ml-1">
                    Infantes
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Desktop horizontal nav — visible only on lg+ */}
          <div class="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.command}
                class="px-3 py-1.5 rounded-lg font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--coral-bright)]/10 transition-all duration-200 whitespace-nowrap"
                onClick={() => {
                  handleCommand(item.command);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Columna derecha - Status + Hamburger (mobile only) */}
          <div class="flex items-center gap-4">
            {/* Status badge */}
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span class="w-2 h-2 rounded-full bg-[var(--cyan-bright)] animate-pulse"></span>
              <span class="text-xs font-mono text-[var(--text-muted)]">Online</span>
            </div>

            {/* Hamburger button — hidden on lg+ (desktop has inline nav) */}
            <button
              class="p-2 rounded-lg hover:bg-[var(--coral-bright)]/10 transition-all duration-300 focus-ring lg:hidden"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              <HamburgerIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </nav>
      </header>

      {/* Dropdown menu — only used on mobile/tablet (< lg) */}
      <div
        class={`fixed top-[60px] right-4 z-50 transition-all duration-300 lg:hidden ${
          isMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div class="glass-panel border border-[var(--border-subtle)] rounded-xl p-2 min-w-[200px] shadow-2xl">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={item.command}
              class="w-full px-4 py-3 rounded-lg font-mono text-sm text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--coral-bright)]/10 transition-all duration-200 flex items-center gap-3"
              onClick={() => {
                handleCommand(item.command);
              }}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <span class="text-[var(--coral-bright)]">→</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop — only on mobile/tablet */}
      {isMenuOpen && (
        <div
          class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => {
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
}
