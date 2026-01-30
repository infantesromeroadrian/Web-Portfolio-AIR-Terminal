/**
 * Footer del portfolio.
 *
 * Este componente cumple una función estética y contextual:
 *  - Cierra visualmente la página
 *  - Refuerza la identidad profesional del autor
 *  - Mantiene coherencia con el tema Blue Cyber (bordes azules, fondo oscuro)
 *
 * Responsabilidad:
 *  - Es puramente visual
 *  - No contiene lógica de negocio
 *  - No gestiona estado
 *
 * Mantener este componente simple y aislado permite modificar la estética
 * sin afectar al resto de la aplicación.
 */

export default function Footer() {
  return (
    /**
     * Contenedor principal del footer.
     *
     * Decisiones de diseño:
     *  - bg-black/80 → fondo oscuro semitransparente
     *  - border-t border-blue-600 → coherencia con el resto de la UI
     *  - backdrop-blur-sm → efecto de cristal oscuro
     *  - mt-10 → separación visual respecto al contenido superior
     */
    <footer class="w-full bg-black/80 border-t border-blue-600/50 backdrop-blur-sm mt-10 py-6 pb-20 sm:pb-6">
      <div class="max-w-6xl mx-auto text-center font-mono space-y-2 px-4">
        {/**
         * Línea principal del footer — nombre y rol con hierarchy.
         */}
        <div class="text-[var(--white-soft)]">
          <span class="text-base font-semibold">
            © {new Date().getFullYear()} Adrián Infantes Romero
          </span>
        </div>
        <div class="text-sm text-gray-400">
          <span class="text-[var(--accent)]">AI Security Architect</span>
          <span class="mx-2 text-gray-600">|</span>
          <span class="text-[var(--cyan-glow)]">Blue Cyber AI</span>
        </div>

        {/**
         * Línea secundaria estilo terminal.
         */}
        <div class="text-xs text-gray-500 pt-2">
          <span class="text-[var(--accent)]">root@portfolio~#</span>{" "}
          <span class="text-gray-400">exit</span>
          <span class="terminal-cursor ml-1" style="height: 0.9em; width: 0.5em"></span>
        </div>
      </div>
    </footer>
  );
}
