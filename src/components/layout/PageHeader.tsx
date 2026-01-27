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
     * - border-blue-600 → coherencia con estética Purple Team / AI Security
     * - fixed + z-50 → siempre visible por encima del contenido
     */
    <header class="w-full bg-black/80 border-b border-blue-600 backdrop-blur-sm fixed top-0 left-0 z-50">
      <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center">
        {/**
         * LOGO (columna izquierda)
         *
         * Representa la identidad del portfolio.
         * Se usa tipografía monoespaciada y colores rojos para mantener
         * coherencia visual con el resto de la interfaz.
         */}
        <div class="flex-shrink-0">
          <div class="text-[var(--red-accent)] font-mono font-bold text-lg">
            <span class="text-[var(--red-soft)] mr-2">&gt;</span>AIR_SECURITY
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
          <button class="nav-btn" onClick={() => void runCommand("whoami")}>
            WHOAMI
          </button>
          <button class="nav-btn" onClick={() => void runCommand("cat profile.txt")}>
            PERFIL
          </button>
          <button class="nav-btn" onClick={() => void runCommand("cat edu.txt")}>
            ESTUDIOS
          </button>
          <button class="nav-btn" onClick={() => void runCommand("cat exp.txt")}>
            EXPERIENCIA
          </button>
          <button class="nav-btn" onClick={() => void runCommand("cat skills.txt")}>
            HABILIDADES
          </button>
          <button class="nav-btn" onClick={() => void runCommand("cat certs.txt")}>
            CERTIFICACIONES
          </button>
          <button class="nav-btn" onClick={() => void runCommand("ls projects/")}>
            PROYECTOS
          </button>
          <button class="nav-btn" onClick={() => void runCommand("cat contact.txt")}>
            CONTACTO
          </button>


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
          <button class="flex flex-col space-y-1" onClick={onMenuToggle}>
            <span class="block w-6 h-[2px] bg-[var(--red-soft)]"></span>
            <span class="block w-6 h-[2px] bg-[var(--red-soft)]"></span>
            <span class="block w-6 h-[2px] bg-[var(--red-soft)]"></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
