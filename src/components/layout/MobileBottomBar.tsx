/**
 * Barra de navegación inferior para móviles.
 *
 * Proporciona acceso rápido a TODAS las secciones de la terminal
 * con scroll horizontal. Solo visible en pantallas < lg (desktop
 * tiene el navbar horizontal inline).
 *
 * Uses NAV_ITEMS as single source of truth to maintain parity
 * with the desktop navigation.
 */

import { NAV_ITEMS } from "../../core/navItems";

// ── Icon mapping for mobile bottom bar ──────────────────────

/** Map nav commands to compact icons for mobile display */
const ICON_MAP: Record<string, string> = {
  whoami: "👤",
  estudios: "🎓",
  experiencia: "💼",
  skills: "⚡",
  certificaciones: "🏆",
  proyectos: "📁",
  blog: "📝",
  threats: "🔴",
};

interface MobileBottomBarProps {
  runCommand: (cmd: string) => Promise<void>;
}

export default function MobileBottomBar({ runCommand }: MobileBottomBarProps) {
  return (
    <nav
      class="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-black/95 border-t border-blue-600/50 backdrop-blur-sm"
      aria-label="Navegación móvil"
    >
      <div class="flex overflow-x-auto scrollbar-hide py-2 px-2 gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.command}
            onClick={() => void runCommand(item.command)}
            class="flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all active:scale-95 focus-ring min-w-[52px] flex-shrink-0"
            aria-label={item.label}
          >
            <span class="text-base mb-0.5">{ICON_MAP[item.command] ?? "▸"}</span>
            <span class="text-[9px] text-gray-400 font-mono whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
