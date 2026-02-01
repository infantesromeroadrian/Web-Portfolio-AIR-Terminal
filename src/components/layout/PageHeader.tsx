/**
 * Header principal - Rediseño con logo y estilo premium.
 *
 * Este componente:
 *  - Muestra identidad visual con logo SVG distintivo
 *  - Ofrece navegación rápida mediante comandos
 *
 * Diseño: Glassmorphism, tipografía display, transiciones suaves.
 */

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

export default function PageHeader({ runCommand }: { runCommand: (cmd: string) => Promise<void> }) {
  return (
    <header class="w-full glass-panel border-b border-[var(--border-subtle)] fixed top-0 left-0 z-50">
      <nav
        class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center"
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

        {/* Menú central (tablet y desktop) */}
        <div class="hidden md:flex flex-1 justify-center gap-0.5 lg:gap-1 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.command}
              class="px-2 lg:px-4 py-2 rounded-lg font-mono text-xs lg:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--coral-bright)]/10 transition-all duration-300 focus-ring whitespace-nowrap flex-shrink-0"
              onClick={() => void runCommand(item.command)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Columna derecha - Status badge */}
        <div class="flex items-center gap-3 ml-auto flex-shrink-0">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <span class="w-2 h-2 rounded-full bg-[var(--cyan-bright)] animate-pulse"></span>
            <span class="text-xs font-mono text-[var(--text-muted)]">Online</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
