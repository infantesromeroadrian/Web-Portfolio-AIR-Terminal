/**
 * Prompt de la terminal.
 *
 * Este componente representa la línea de comando estilo terminal Linux.
 * Es un componente puramente visual:
 *  - No contiene lógica de negocio
 *  - No ejecuta comandos
 *  - No gestiona estado
 *
 * Su responsabilidad es mostrar:
 *  - El prompt (usuario/host/ruta)
 *  - El comando actual (si existe)
 *  - El mensaje de bienvenida inicial (solo una vez)
 *  - El cursor parpadeante cuando no hay comando en curso
 *
 * Mantener este componente pequeño y aislado permite que:
 *  - La animación del comando viva en useTerminal()
 *  - La UI sea fácilmente modificable sin tocar la lógica
 *  - Se respete el principio SRP (Single Responsibility Principle)
 */
export default function TerminalPrompt({
  command, // Comando que se está mostrando (solo visual)
  welcomeMessage, // Mensaje inicial adaptado a móvil/tablet/desktop
}: {
  command?: string;
  welcomeMessage?: string;
}) {
  return (
    <div class="font-mono text-sm leading-tight">
      {/**
       * Primera línea del prompt.
       *
       * Se replica el estilo del prompt:
       * ┌──(air㉿portfolio)-[~]
       *
       * Se usan spans con colores para mantener coherencia visual
       * con el resto del portfolio (tema Red Team).
       */}
      <div class="text-[var(--red-accent)]">
        ┌──(
        <span class="text-[var(--white-soft)]">air</span>
        <span class="text-[var(--red-soft)]">㉿</span>
        <span class="text-[var(--white-soft)]">portfolio</span>
        )-[<span class="text-[var(--white-soft)]">~</span>]
      </div>

      {/**
       * Segunda línea del prompt.
       *
       * Estructura:
       * └─$ <comando> <mensaje bienvenida> <cursor>
       *
       * El cursor solo aparece cuando no hay comando en curso.
       * Esto mantiene sincronía visual con la animación de useTerminal().
       */}
      <div class="flex items-center">
        <span class="text-[var(--red-accent)]">└─$</span>

        {/**
         * Si existe un comando (durante animación o después),
         * se muestra aquí.
         */}
        {command && <span class="ml-2 text-[var(--white-soft)]">{command}</span>}

        {/**
         * Si existe un mensaje de bienvenida (solo la primera vez),
         * se muestra aquí.
         *
         * Esto permite que el usuario vea un mensaje contextual
         * sin interferir con la animación del comando.
         */}
        {welcomeMessage && <span class="ml-2 text-[var(--white-soft)]">{welcomeMessage}</span>}

        {/**
         * Cursor parpadeante.
         *
         * Solo se muestra cuando:
         * - No hay comando en curso
         * - No se está animando typing
         *
         * La clase "cursor-blink" está definida en CSS global.
         */}
        {!command && <span class="ml-2 cursor-blink text-[var(--red-soft)]">█</span>}
      </div>
    </div>
  );
}
