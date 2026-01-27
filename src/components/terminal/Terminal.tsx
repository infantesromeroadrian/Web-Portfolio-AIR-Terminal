/**
 * Contenedor principal de la terminal.
 *
 * Este componente actúa como "shell visual" de la terminal:
 *  - Renderiza el header (barra superior estilo terminal)
 *  - Renderiza el cuerpo donde se muestra el historial y el prompt
 *  - Aplica estilos globales de layout (bordes, fondo, sombras)
 *
 * Importante:
 *  - No contiene lógica de negocio
 *  - No ejecuta comandos
 *  - No gestiona estado interno
 *
 * Su única responsabilidad es estructurar la interfaz de la terminal
 * usando los datos y funciones que recibe desde useTerminal().
 *
 * Esto sigue el principio SRP (Single Responsibility Principle - SOLID).
 */

import TerminalHeader from "./TerminalHeader";
import TerminalBody from "./TerminalBody";
import type { TerminalState } from "../../types/data";

export default function Terminal({ terminal }: { terminal: TerminalState }) {
  return (
    /**
     * Contenedor visual de la terminal.
     *
     * Decisiones de diseño:
     *  - max-w-6xl → ancho óptimo para lectura
     *  - rounded-lg + shadow → estética de ventana real
     *  - border-blue-600 → coherencia con el tema Blue Cyber / AI Security
     *  - backdrop-blur-sm → efecto de cristal oscuro
     */
    <div class="w-full max-w-6xl mx-auto mt-10 rounded-lg overflow-hidden shadow-lg shadow-black/40 border border-blue-600 bg-[#0d0d0d]/95 backdrop-blur-sm">
      {/* Barra superior estilo terminal */}
      <TerminalHeader />

      {/* Cuerpo principal: historial + prompt */}
      <TerminalBody terminal={terminal} />
    </div>
  );
}
