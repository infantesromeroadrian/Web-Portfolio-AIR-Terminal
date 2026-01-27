/**
 * Menú lateral de navegación.
 *
 * Este componente está diseñado con enfoque mobile-first:
 *  - En pantallas pequeñas actúa como menú principal
 *  - En pantallas grandes complementa al menú del header
 *
 * Responsabilidades:
 *  - Mostrar/ocultar el menú mediante animaciones CSS
 *  - Renderizar accesos rápidos a los comandos de la terminal
 *  - Cerrar automáticamente al seleccionar una opción
 *  - Mostrar un overlay que bloquea la interacción con el fondo
 *
 * Importante:
 *  - No contiene lógica de negocio
 *  - No interpreta comandos
 *  - Solo delega en runCommand(), que proviene de useTerminal()
 *
 * Esto mantiene la UI completamente desacoplada de la lógica interna (SRP - SOLID).
 */

import { NAV_ITEMS } from "../../core/navItems";

export default function SideMenu({
  open,
  onClose,
  runCommand,
}: {
  open: boolean; // Controla si el menú está visible
  onClose: () => void; // Cierra el menú (solo UI)
  runCommand: (cmd: string) => Promise<void>; // Ejecuta comandos en la terminal
}) {
  return (
    <>
      {/**
       * OVERLAY OSCURO
       *
       * - Cubre toda la pantalla cuando el menú está abierto
       * - Permite cerrar el menú haciendo clic fuera
       * - Usa pointer-events-none cuando está oculto para evitar capturar clics
       *
       * Animaciones:
       *  - opacity-0 → opacity-100 con transición suave
       */}
      <div
        class={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/**
       * MENÚ LATERAL
       *
       * - Posicionado a la derecha
       * - Se desplaza con transform: translate-x-full → translate-x-0
       *  - Mantiene estética Blue Cyber con bordes azules y fondo oscuro
       *
       * Decisión de diseño:
       *  - Se usa transform en lugar de left/right para animaciones más fluidas
       *  - Se mantiene z-50 para estar por encima del overlay
       */}
      <aside
        class={`fixed top-0 right-0 h-full w-64 bg-[#0a0a0a] border-l border-blue-600 shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div class="p-6 font-mono text-[var(--white-soft)] space-y-8">
          {/**
           * NAVEGACIÓN PRINCIPAL (solo visible en móvil)
           *
           * Cada botón:
           *  - Cierra el menú
           *  - Ejecuta un comando en la terminal
           *
           * Esto permite navegar sin escribir manualmente.
           */}
          <div class="space-y-2 lg:hidden">
            <p class="text-sm text-[var(--gray-terminal)]">Navegación</p>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.command}
                class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-blue-900/30 transition"
                onClick={() => void runCommand(item.command)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
