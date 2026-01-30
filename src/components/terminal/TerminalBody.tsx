/**
 * Cuerpo principal de la terminal.
 *
 * Este componente es responsable de:
 *  - Renderizar el historial de salida generado por useTerminal()
 *  - Mostrar el mensaje de bienvenida inicial según el dispositivo
 *  - Renderizar el prompt interactivo con input real de teclado
 *  - TAB autocomplete para comandos
 *  - Historial de comandos con flechas ↑↓
 *
 * Importante:
 *  - Este componente NO contiene lógica de negocio.
 *  - Solo interpreta el estado que recibe desde useTerminal().
 *  - Mantiene la UI desacoplada de la lógica interna (SRP - SOLID).
 */
import { useRef, useState, useEffect } from "preact/hooks";
import ascii from "../../data/ascii.json";
import type { TerminalState, OutputItem, AsciiData } from "../../types/data";
import { sanitizeHtml } from "../../core/utils/sanitize";
import { useWindowSize, getDeviceType } from "../../core/hooks/useWindowSize";
import { useKeySound } from "../../core/hooks/useKeySound";

// Type assertion para el JSON de ASCII
const asciiData = ascii as AsciiData;

export default function TerminalBody({ terminal }: { terminal: TerminalState }) {
  /**
   * Hook reactivo para tamaño de ventana.
   */
  const { width } = useWindowSize();
  const deviceType = getDeviceType(width);

  /**
   * Hook de sonido de teclado.
   */
  const { playClick } = useKeySound();

  /**
   * Selección del mensaje de bienvenida según tamaño de pantalla.
   */
  const welcomeMessage: string | undefined = !terminal.hasInteracted
    ? deviceType === "mobile"
      ? asciiData.messageMobile
      : deviceType === "tablet"
        ? asciiData.messageTablet
        : asciiData.messageDesktop
    : undefined;

  /**
   * Estado del input del usuario.
   */
  const [inputValue, setInputValue] = useState("");

  /**
   * Índice del historial para navegación con ↑↓.
   * -1 = no navegando (escribiendo nuevo comando).
   */
  const [historyIndex, setHistoryIndex] = useState(-1);

  /**
   * Valor guardado antes de navegar el historial.
   * Permite volver al texto original al bajar con ↓.
   */
  const [savedInput, setSavedInput] = useState("");

  /**
   * Refs para auto-scroll y auto-focus.
   */
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-scroll al final cuando cambia el output.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminal.output]);

  /**
   * Auto-focus en el input cuando la terminal está activa.
   */
  useEffect(() => {
    if (!terminal.isTypingCommand) {
      inputRef.current?.focus();
    }
  }, [terminal.isTypingCommand, terminal.output]);

  /**
   * Maneja el envío de un comando (Enter).
   */
  function handleSubmit(): void {
    const cmd = inputValue;
    setInputValue("");
    setHistoryIndex(-1);
    setSavedInput("");
    terminal.executeUserCommand(cmd);
  }

  /**
   * Maneja teclas especiales en el input.
   *
   * - Enter → ejecutar comando
   * - Tab → autocompletar
   * - ArrowUp/ArrowDown → navegar historial
   * - Escape → limpiar input
   */
  function handleKeyDown(e: KeyboardEvent): void {
    // Reproducir click para teclas alfanuméricas
    if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
      playClick();
    }

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleSubmit();
        break;

      case "Tab": {
        e.preventDefault();
        const current = inputValue.trim().toLowerCase();
        if (current === "") break;

        // Buscar comandos que coincidan
        const matches = terminal.availableCommands.filter((cmd) =>
          cmd.toLowerCase().startsWith(current)
        );

        if (matches.length === 1) {
          // Match exacto → completar
          setInputValue(matches[0]);
        } else if (matches.length > 1) {
          // Múltiples matches → encontrar prefijo común más largo
          let commonPrefix = matches[0];
          for (const match of matches) {
            let i = 0;
            while (i < commonPrefix.length && i < match.length && commonPrefix[i] === match[i]) {
              i++;
            }
            commonPrefix = commonPrefix.slice(0, i);
          }
          if (commonPrefix.length > current.length) {
            setInputValue(commonPrefix);
          }
        }
        break;
      }

      case "ArrowUp": {
        e.preventDefault();
        const history = terminal.commandHistory;
        if (history.length === 0) break;

        if (historyIndex === -1) {
          // Guardar lo que estaba escribiendo
          setSavedInput(inputValue);
        }

        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
        break;
      }

      case "ArrowDown": {
        e.preventDefault();
        const history = terminal.commandHistory;
        if (historyIndex === -1) break;

        if (historyIndex >= history.length - 1) {
          // Volver al texto original
          setHistoryIndex(-1);
          setInputValue(savedInput);
        } else {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInputValue(history[newIndex]);
        }
        break;
      }

      case "Escape":
        e.preventDefault();
        setInputValue("");
        setHistoryIndex(-1);
        break;

      case "l":
        // Ctrl+L → clear
        if (e.ctrlKey) {
          e.preventDefault();
          terminal.clear();
        }
        break;

      default:
        break;
    }
  }

  /**
   * Click en cualquier parte de la terminal → focus al input.
   */
  function handleContainerClick(): void {
    inputRef.current?.focus();
  }

  return (
    <div
      ref={scrollRef}
      class="terminal-scroll p-4 font-mono text-[var(--white-soft)] text-sm h-[60vh] overflow-y-auto overflow-x-auto cursor-text"
      onClick={handleContainerClick}
      role="log"
      aria-live="polite"
      aria-label="Salida de terminal"
    >
      {/* Renderizado del historial de salida */}
      {terminal.output.map((item: OutputItem, idx: number) =>
        item.type === "raw" ? (
          <pre key={idx} class="whitespace-pre mb-2">
            {item.content}
          </pre>
        ) : (
          <div
            key={idx}
            class="whitespace-pre-wrap break-words mb-2"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }}
          />
        )
      )}

      {/* Input interactivo (solo si no se está animando un comando) */}
      {!terminal.isTypingCommand && (
        <div class="mt-2 font-mono text-sm leading-tight">
          {/* Línea 1 del prompt */}
          <div class="text-[var(--accent)]">
            ┌──(
            <span class="text-[var(--white-soft)]">air</span>
            <span class="text-[var(--accent-soft)]">㉿</span>
            <span class="text-[var(--white-soft)]">portfolio</span>
            )-[<span class="text-[var(--white-soft)]">~</span>]
          </div>

          {/* Línea 2 del prompt con input real */}
          <div class="flex items-center">
            <span class="text-[var(--accent)]">└─$</span>

            {/* Mensaje de bienvenida (solo primera vez, sin input) */}
            {welcomeMessage && !terminal.hasInteracted && (
              <span class="ml-2 text-[var(--white-soft)]">{welcomeMessage}</span>
            )}

            {/* Input real del usuario con cursor blink */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              spellcheck={false}
              autocomplete="off"
              autocapitalize="off"
              aria-label="Comando de terminal"
              class="ml-2 flex-1 bg-transparent border-none outline-none text-[var(--white-soft)] font-mono text-sm caret-transparent"
              style="caret-color: transparent"
              onInput={(e) => {
                setInputValue((e.target as HTMLInputElement).value);
                setHistoryIndex(-1);
              }}
              onKeyDown={(e) => {
                handleKeyDown(e as unknown as KeyboardEvent);
              }}
            />
            {/* Cursor parpadeante real */}
            <span class="terminal-cursor" aria-hidden="true"></span>
          </div>
        </div>
      )}
    </div>
  );
}
