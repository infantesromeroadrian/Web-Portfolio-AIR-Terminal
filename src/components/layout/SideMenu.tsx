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

            {/* WHOAMI */}
            <button
              class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-blue-900/30 transition"
              onClick={() => {
                onClose();
                void runCommand("whoami");
              }}
            >
              WHOAMI
            </button>

            {/* PERFIL */}
            <button
              class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-blue-900/30 transition"
              onClick={() => {
                onClose();
                void runCommand("cat profile.txt");
              }}
            >
              PERFIL
            </button>

            {/* ESTUDIOS */}
            <button
              class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-blue-900/30 transition"
              onClick={() => {
                onClose();
                void runCommand("cat edu.txt");
              }}
            >
              ESTUDIOS
            </button>

            {/* EXPERIENCIA */}
            <button
              class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-blue-900/30 transition"
              onClick={() => {
                onClose();
                void runCommand("cat exp.txt");
              }}
            >
              EXPERIENCIA
            </button>

            {/* HABILIDADES */}
            <button
              class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-blue-900/30 transition"
              onClick={() => {
                onClose();
                void runCommand("cat skills.txt");
              }}
            >
              HABILIDADES
            </button>

            {/* CERTIFICACIONES */}
            <button
              class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-blue-900/30 transition"
              onClick={() => {
                onClose();
                void runCommand("cat certs.txt");
              }}
            >
              CERTIFICACIONES
            </button>

            {/* PROYECTOS */}
            <button
              class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-blue-900/30 transition"
              onClick={() => {
                onClose();
                void runCommand("ls projects/");
              }}
            >
              PROYECTOS
            </button>

            {/* CONTACTO */}
            <button
              class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-blue-900/30 transition"
              onClick={() => {
                onClose();
                void runCommand("cat contact.txt");
              }}
            >
              CONTACTO
            </button>
          </div>

          {/**
           * SECCIÓN FUTURA
           *
           * Espacio reservado para futuras funcionalidades:
           *  - Cambio de tema (Blue Cyber/Dark/Light)
           *  - Ajustes de idioma
           *  - ...
           *
           */}
          {/* <div class="space-y-2"> ... </div> */}

          {/**
           * SECCIÓN "Más opciones"
           *
           * Placeholder para futuras extensiones del menú.
           * Mantiene la estructura modular del componente.
           */}
          <div class="space-y-2">
            <p class="text-sm text-[var(--gray-terminal)]">Más opciones</p>

            <button class="w-full text-left px-3 py-2 bg-black border border-gray-600 rounded hover:bg-gray-800 transition">
              Próximamente...
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
