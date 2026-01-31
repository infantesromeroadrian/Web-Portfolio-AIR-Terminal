/**
 * Footer del portfolio - Rediseño estilo premium.
 *
 * Diseño minimalista con gradientes y tipografía moderna.
 */

export default function Footer() {
  return (
    <footer class="w-full glass-panel border-t border-[var(--border-subtle)] mt-10 py-6 pb-20 sm:pb-6">
      <div class="max-w-6xl mx-auto text-center space-y-3 px-4">
        {/* Nombre con gradiente */}
        <div class="font-display font-semibold text-base">
          <span class="text-[var(--text-primary)]">© {new Date().getFullYear()}</span>
          <span class="text-gradient ml-2">Adrian Infantes</span>
        </div>

        {/* Rol con badges */}
        <div class="flex items-center justify-center gap-3 text-sm">
          <span class="text-[var(--coral-bright)]">AI Security Architect</span>
          <span class="text-[var(--text-muted)]">•</span>
          <span class="text-[var(--cyan-bright)]">Blue Cyber AI</span>
        </div>

        {/* Terminal prompt */}
        <div class="text-xs text-[var(--text-muted)] pt-2 font-mono flex items-center justify-center gap-1">
          <span class="text-[var(--coral-bright)]">→</span>
          <span>Connection secure</span>
          <span class="w-2 h-2 rounded-full bg-[var(--cyan-bright)] animate-pulse ml-2"></span>
        </div>
      </div>
    </footer>
  );
}
