/**
 * Panel de login inicial.
 *
 * Este componente simula un proceso de autenticación estilo terminal:
 *  - Escribe automáticamente un usuario y contraseña ficticios
 *  - Tras completar la animación, llama a onLogin() para entrar en la terminal
 *
 * Importante:
 *  - No valida credenciales reales (no es un login funcional)
 *  - No contiene lógica de negocio
 *  - Su única responsabilidad es la animación y la transición visual
 *
 * Esto sigue el principio SRP (Single Responsibility Principle - SOLID).
 */

import { useEffect, useState } from "preact/hooks";

export default function LoginPanel({ onLogin }: { onLogin: () => void }) {
  /**
   * Estados locales que almacenan el texto animado.
   * Se actualizan carácter por carácter para simular escritura humana.
   */
  const [userText, setUserText] = useState("");
  const [passText, setPassText] = useState("");

  /**
   * Animación automática de escritura.
   *
   * Flujo:
   *  1. Espera inicial para dar sensación de carga
   *  2. Escribe "air" carácter por carácter
   *  3. Escribe "**************" como contraseña
   *  4. Tras terminar, ejecuta onLogin() con un pequeño delay
   *
   * Decisiones de diseño:
   *  - La animación crea una experiencia inmersiva estilo hacker
   *  - Los intervalos se limpian correctamente para evitar fugas de memoria
   *  - Los inputs son readOnly para reforzar que no es un login real
   */
  useEffect(() => {
    const user = "air";
    const pass = "**************";

    let userInterval: number | undefined;
    let passInterval: number | undefined;

    // Pequeña pausa inicial para mejorar la experiencia visual
    const timeout = setTimeout(() => {
      let i = 0;

      // Animación del usuario
      userInterval = setInterval(() => {
        setUserText(user.slice(0, i));
        i++;

        if (i > user.length) {
          clearInterval(userInterval);

          let j = 0;

          // Animación de la contraseña
          passInterval = setInterval(() => {
            setPassText(pass.slice(0, j));
            j++;

            if (j > pass.length) {
              clearInterval(passInterval);

              // Pequeña pausa antes de entrar a la terminal
              setTimeout(() => {
                onLogin();
              }, 400);
            }
          }, 80);
        }
      }, 80);
    }, 500);

    /**
     * Limpieza de timers.
     * Esto evita fugas de memoria si el componente se desmonta
     * antes de que la animación termine.
     */
    return () => {
      clearTimeout(timeout);
      clearInterval(userInterval);
      clearInterval(passInterval);
    };
    // onLogin es estable (viene del padre), no necesita incluirse
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div class="w-full max-w-md relative z-10">
      {/**
       * HEADER DEL PANEL
       *
       * Replica la estética de una ventana de terminal:
       *  - Botones estilo macOS
       *  - Prompt root@portfolio
       *  - Bordes azules para mantener coherencia con el tema Blue Cyber / AI Security
       */}
      <div class="bg-black border-2 border-blue-600 rounded-t-lg p-3 flex items-center space-x-2 border-top-accent">
        <div class="flex space-x-2">
          <div class="w-3 h-3 rounded-full bg-blue-600"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        <span class="text-[var(--accent)] font-mono text-sm flex-1 text-center">
          root@portfolio:~$
        </span>
      </div>

      {/**
       * CUERPO DEL PANEL
       *
       * Contiene:
       *  - Título del portfolio
       *  - Inputs animados de usuario y contraseña
       *  - Botón para saltar la animación manualmente
       *
       * Decisión de diseño:
       *  - Los inputs son readOnly porque la animación es automática
       *  - El botón permite a usuarios impacientes avanzar rápido
       */}
      <div class="panel-bg border-2 border-t-0 border-blue-600 rounded-b-lg p-8 shadow-xl shadow-blue-600/20 backdrop-blur-sm">
        {/* Logo con efecto glitch */}
        <div class="flex justify-center mb-6">
          <div class="relative glitch-container scanlines w-32 h-32">
            <img
              src={`${import.meta.env.BASE_URL}favicon.png`}
              alt="AIR Security Logo"
              class="w-32 h-32 rounded-lg border border-blue-600/30"
              style="filter: drop-shadow(0 0 20px rgba(37, 99, 235, 0.4));"
            />
          </div>
        </div>

        {/* Título y subtítulo */}
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-mono font-bold text-[var(--accent)] mb-2">
            AI SECURITY ARCHITECT
          </h1>

          <p class="text-[var(--gray-terminal)] font-mono text-sm">
            <span class="text-[var(--accent-soft)]">[-]</span> Acceso restringido - Autenticación
            requerida
          </p>
        </div>

        {/* Formulario visual (no funcional) */}
        <form
          class="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          {/* Usuario */}
          <div>
            <label class="block text-[var(--gray-terminal)] font-mono text-sm mb-2">
              <span class="text-[var(--accent-soft)]">&gt;</span> Usuario:
            </label>

            <input
              type="text"
              class="w-full bg-[#0a0a0a] border border-gray-700 rounded px-4 py-3 text-[var(--white-soft)] font-mono focus:outline-none focus:border-[var(--accent)] transition-all"
              value={userText}
              readOnly
            />
          </div>

          {/* Contraseña */}
          <div>
            <label class="block text-[var(--gray-terminal)] font-mono text-sm mb-2">
              <span class="text-[var(--accent-soft)]">&gt;</span> Contraseña:
            </label>

            <input
              type="password"
              class="w-full bg-[#0a0a0a] border border-gray-700 rounded px-4 py-3 text-[var(--white-soft)] font-mono focus:outline-none focus:border-[var(--accent)] transition-all"
              value={passText}
              readOnly
            />
          </div>

          {/* Botón para iniciar sesión manualmente */}
          <button
            type="button"
            onClick={onLogin}
            class="w-full bg-[var(--accent)] hover:bg-[var(--accent-soft)] text-black font-mono font-bold py-3 px-4 rounded border border-[var(--accent)] transition-all duration-200 glow-accent"
          >
            [INICIAR SESIÓN]
          </button>
        </form>
      </div>
    </div>
  );
}
