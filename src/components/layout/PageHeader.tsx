/**
 * Header principal de la aplicación en modo terminal.
 *
 * Este componente cumple varias funciones clave:
 *  - Mostrar la identidad visual del portfolio (logo estilo hacker)
 *  - Ofrecer navegación rápida mediante comandos predefinidos
 *  - Gestionar el menú lateral en dispositivos móviles
 *
 * Importante:
 *  - Este componente NO ejecuta lógica de negocio.
 *  - Solo delega en runCommand(), que proviene de useTerminal().
 *  - Mantiene la UI desacoplada de la lógica interna (SRP - SOLID).
 *
 * Diseño:
 *  - Mobile-first: en pantallas pequeñas se oculta el menú central
 *  - Desktop: se muestra navegación completa
 *  - Botón hamburguesa siempre visible para UX consistente
 */

import { NAV_ITEMS } from "../../core/navItems";

export default function PageHeader({
  onMenuToggle,
  runCommand,
}: {
  onMenuToggle: () => void; // Abre el menú lateral (solo UI)
  runCommand: (cmd: string) => Promise<void>; // Ejecuta comandos en la terminal
}) {
  return (
    /**
     * Header fijo en la parte superior.
     *
     * - bg-black/80 + backdrop-blur-sm → efecto de cristal oscuro
     * - border-blue-600 → coherencia con estética Blue Cyber / AI Security
     * - fixed + z-50 → siempre visible por encima del contenido
     */
    <header class="w-full bg-black/80 border-b border-blue-600 backdrop-blur-sm fixed top-0 left-0 z-50">
      <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center" aria-label="Navegación principal">
        {/**
         * LOGO (columna izquierda)
         *
         * Representa la identidad del portfolio.
         * Se usa tipografía monoespaciada y colores azules para mantener
         * coherencia visual con el resto de la interfaz.
         */}
        <div class="flex-shrink-0">
          <div class="text-[var(--accent)] font-mono font-bold text-lg">
            <span class="text-[var(--accent-soft)] mr-2">&gt;</span>AIR_SECURITY
          </div>
        </div>

        {/**
         * MENÚ CENTRAL (solo visible en pantallas grandes)
         *
         * Cada botón ejecuta un comando en la terminal.
         * Esto permite navegar por el portfolio sin escribir manualmente.
         *
         * Decisión de diseño:
         *  - Se usa runCommand() directamente para mantener la UI simple.
         *  - No se usa router ni lógica adicional.
         */}
        <div class="hidden lg:flex flex-1 justify-center space-x-6 font-mono text-sm">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.command}
              class="nav-btn focus-ring rounded px-2 py-1"
              onClick={() => void runCommand(item.command)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/**
         * COLUMNA DERECHA
         *
         * Contiene:
         *  - Botón hamburguesa (siempre visible)
         *
         * Decisión de diseño:
         *  - El botón hamburguesa se mantiene visible incluso en desktop
         *    para mantener consistencia visual y accesibilidad.
         */}
        <div class="flex items-center space-x-4 ml-auto flex-shrink-0">
          <button
            class="flex flex-col space-y-1.5 p-2 rounded focus-ring group transition-all"
            onClick={onMenuToggle}
            aria-label="Abrir menú de navegación"
          >
            <span class="block w-6 h-[2px] bg-[var(--accent-soft)] transition-all group-hover:bg-[var(--white-soft)] group-hover:w-7"></span>
            <span class="block w-6 h-[2px] bg-[var(--accent-soft)] transition-all group-hover:bg-[var(--white-soft)]"></span>
            <span class="block w-6 h-[2px] bg-[var(--accent-soft)] transition-all group-hover:bg-[var(--white-soft)] group-hover:w-5"></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
