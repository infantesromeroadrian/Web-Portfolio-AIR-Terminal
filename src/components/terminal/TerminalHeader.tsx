/**
 * Barra superior de la terminal.
 *
 * Este componente replica la estética clásica de una ventana de terminal:
 *  - Botones estilo macOS (cerrar, minimizar, maximizar)
 *  - Título centrado con el prompt root@portfolio
 *  - Toggle de sonido de teclado
 *  - Versión de la terminal alineada a la derecha
 *
 * Responsabilidad:
 *  - Es puramente visual + toggle de sonido
 *  - No contiene lógica de negocio
 */

import { useKeySound } from "../../core/hooks/useKeySound";

export default function TerminalHeader() {
  const { soundEnabled, toggleSound } = useKeySound();

  return (
    <div class="bg-black border-b border-blue-600">
      <div class="grid grid-cols-3 items-center px-4 py-2">
        {/* COLUMNA IZQUIERDA — Botones estilo macOS */}
        <div class="flex space-x-2">
          <div class="w-3 h-3 rounded-full bg-blue-600"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* COLUMNA CENTRAL — Título de la terminal */}
        <div class="flex justify-center">
          <span class="text-[var(--red-accent)] font-mono text-sm">root@portfolio:~#</span>
        </div>

        {/* COLUMNA DERECHA — Toggle sonido + Versión */}
        <div class="flex justify-end items-center space-x-3">
          <button
            onClick={() => { toggleSound(); }}
            class="text-xs font-mono transition-colors hover:text-[var(--white-soft)]"
            style={{ color: soundEnabled ? "#3b82f6" : "#555" }}
            title={soundEnabled ? "Sonido: ON" : "Sonido: OFF"}
          >
            {soundEnabled ? "♪ ON" : "♪ OFF"}
          </button>
          <span class="text-[var(--grey-accent)] font-mono text-sm">Terminal V2.0</span>
        </div>
      </div>
    </div>
  );
}
