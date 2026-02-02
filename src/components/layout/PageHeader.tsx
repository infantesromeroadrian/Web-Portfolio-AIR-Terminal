/**
 * Header principal - Con menú hamburguesa.
 *
 * Este componente:
 *  - Muestra identidad visual con logo SVG distintivo
 *  - Menú hamburguesa para navegación limpia
 *
 * Diseño: Glassmorphism, tipografía display, transiciones suaves.
 */

import { useState } from "preact/hooks";
import { NAV_ITEMS } from "../../core/navItems";

/**
 * Logo SVG distintivo - Shield con AI
 */
function LogoIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-8 h-8 sm:w-9 sm:h-9"
    >
      {/* Shield base */}
      <path
        d="M20 2L4 8v12c0 10 16 18 16 18s16-8 16-18V8L20 2z"
        fill="url(#shield-gradient)"
        stroke="var(--coral-bright)"
        stroke-width="1.5"
      />
      {/* AI text */}
      <text
        x="20"
        y="24"
        text-anchor="middle"
        fill="white"
        font-family="var(--font-display)"
        font-size="12"
        font-weight="700"
      >
        AI
      </text>
      {/* Glow effect */}
      <defs>
        <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--coral-bright)" stop-opacity="0.9" />
          <stop offset="100%" stop-color="var(--coral-dark)" stop-opacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
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

export default function PageHeader({ runCommand }: { runCommand: (cmd: string) => Promise<void> }) {
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
            <LogoIcon />
            <div class="hidden sm:block">
              <span class="font-display font-semibold text-lg text-[var(--text-primary)]">
                Adrian
              </span>
              <span class="font-display font-semibold text-lg text-[var(--coral-bright)] ml-1">
                Infantes
              </span>
            </div>
          </div>

          {/* Columna derecha - Status + Hamburger */}
          <div class="flex items-center gap-4">
            {/* Status badge */}
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span class="w-2 h-2 rounded-full bg-[var(--cyan-bright)] animate-pulse"></span>
              <span class="text-xs font-mono text-[var(--text-muted)]">Online</span>
            </div>

            {/* Hamburger button */}
            <button
              class="p-2 rounded-lg hover:bg-[var(--coral-bright)]/10 transition-all duration-300 focus-ring"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              <HamburgerIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </nav>
      </header>

      {/* Dropdown menu */}
      <div
        class={`fixed top-[60px] right-4 z-50 transition-all duration-300 ${
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
              onClick={() => handleCommand(item.command)}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <span class="text-[var(--coral-bright)]">→</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
