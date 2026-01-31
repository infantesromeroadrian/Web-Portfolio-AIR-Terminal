/**
 * Contenedor principal de la terminal - Estilo premium.
 *
 * Este componente actúa como "shell visual" de la terminal:
 *  - Renderiza el header (barra superior estilo terminal)
 *  - Renderiza el cuerpo donde se muestra el historial y el prompt
 *  - Aplica estilos globales de layout
 *
 * Diseño: Glassmorphism con bordes gradient, tipografía JetBrains Mono.
 */

import TerminalHeader from "./TerminalHeader";
import TerminalBody from "./TerminalBody";
import type { TerminalState } from "../../types/data";

export default function Terminal({ terminal }: { terminal: TerminalState }) {
  return (
    <div class="w-full max-w-6xl mx-auto mt-6 sm:mt-10 px-4 sm:px-0">
      <div class="glass-panel rounded-xl overflow-hidden border-top-gradient shadow-2xl shadow-black/50">
        {/* Barra superior estilo terminal */}
        <TerminalHeader />

        {/* Cuerpo principal: historial + prompt */}
        <TerminalBody terminal={terminal} />
      </div>
    </div>
  );
}
