/**
 * Footer del portfolio - Rediseño estilo premium.
 *
 * Diseño minimalista con gradientes, iconos de contacto y tipografía moderna.
 */

const SOCIAL_LINKS = [
  {
    label: "Email",
    href: "mailto:infantesromeroadrian@proton.me",
    icon: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/adrianinfantes/",
    icon: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/infantesromeroadrian",
    icon: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer class="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-deep)]/80 backdrop-blur-sm py-2">
      <div class="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-mono">
        {/* Copyright + Nombre */}
        <span class="text-[var(--text-muted)]">
          © {new Date().getFullYear()}{" "}
          <span class="text-[var(--text-primary)]">Adrian Infantes</span>
        </span>

        <span class="text-[var(--text-muted)] hidden sm:inline">•</span>

        {/* Rol */}
        <span class="text-[var(--coral-bright)]">AI Security Architect</span>

        <span class="text-[var(--text-muted)] hidden sm:inline">•</span>

        {/* Social icons inline */}
        <div class="flex items-center gap-3">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              class="text-[var(--text-muted)] hover:text-[var(--cyan-bright)] transition-colors duration-300 [&_svg]:w-4 [&_svg]:h-4"
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Status */}
        <div class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-[var(--cyan-bright)] animate-pulse"></span>
          <span class="text-[var(--text-muted)]">Secure</span>
        </div>
      </div>
    </footer>
  );
}
