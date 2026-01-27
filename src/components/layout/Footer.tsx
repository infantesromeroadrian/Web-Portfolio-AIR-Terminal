/**
 * Footer del portfolio.
 *
 * Este componente cumple una función estética y contextual:
 *  - Cierra visualmente la página
 *  - Refuerza la identidad profesional del autor
 *  - Mantiene coherencia con el tema Purple Team (bordes violeta, fondo oscuro)
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
     *  - border-t border-violet-600 → coherencia con el resto de la UI
     *  - backdrop-blur-sm → efecto de cristal oscuro
     *  - mt-10 → separación visual respecto al contenido superior
     */
    <footer class="w-full bg-black/80 border-t border-violet-600 backdrop-blur-sm mt-10 py-4">
      <div class="max-w-6xl mx-auto text-center font-mono text-sm text-[var(--white-soft)] space-y-1">
        {/**
         * Línea principal del footer.
         *
         * Incluye:
         *  - Año
         *  - Nombre del autor
         *  - Rol profesional
         *
         * Esto refuerza la identidad del portfolio y da contexto al visitante.
         */}
        <div>© 2026 Adrián Infantes Romero | AI Security Architect | Purple Team AI</div>

        {/**
         * Línea secundaria estilo terminal.
         *
         * "root@portfolio~# exit"
         *
         * Decisión de diseño:
         *  - Simula el cierre de una sesión de terminal
         *  - Refuerza la temática hacker del portfolio
         *  - Añade un toque final elegante y temático
         */}
        <div class="text-[var(--red-accent)]">
          root@portfolio~# <span class="text-[var(--white-soft)]">exit</span>
        </div>
      </div>
    </footer>
  );
}
