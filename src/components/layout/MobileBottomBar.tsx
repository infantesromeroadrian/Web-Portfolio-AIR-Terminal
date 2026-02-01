/**
 * Barra de navegación inferior para móviles.
 *
 * Proporciona acceso rápido a los comandos más usados sin necesidad
 * de abrir el menú lateral o escribir en la terminal.
 *
 * Solo visible en pantallas pequeñas (< 640px).
 */

interface MobileBottomBarProps {
  runCommand: (cmd: string) => Promise<void>;
}

const MOBILE_ACTIONS = [
  { icon: "👤", label: "Whoami", command: "whoami" },
  { icon: "💼", label: "Exp", command: "experiencia" },
  { icon: "📁", label: "Proyectos", command: "proyectos" },
  { icon: "📝", label: "Blog", command: "blog" },
  { icon: "❓", label: "Help", command: "help" },
];

export default function MobileBottomBar({ runCommand }: MobileBottomBarProps) {
  return (
    <nav
      class="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-black/95 border-t border-blue-600/50 backdrop-blur-sm"
      aria-label="Navegación móvil"
    >
      <div class="flex justify-around items-center py-2 px-1">
        {MOBILE_ACTIONS.map((action) => (
          <button
            key={action.command}
            onClick={() => void runCommand(action.command)}
            class="flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all active:scale-95 focus-ring min-w-[56px]"
            aria-label={action.label}
          >
            <span class="text-lg mb-0.5">{action.icon}</span>
            <span class="text-[10px] text-gray-400 font-mono">{action.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
