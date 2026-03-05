/**
 * Hook principal que gestiona toda la lógica de la terminal.
 *
 * Este hook encapsula:
 *  - Estado del historial de salida
 *  - Historial de comandos del usuario (↑↓)
 *  - Lista de comandos disponibles (para TAB autocomplete)
 *  - Animación de escritura del comando (para botones del header)
 *  - Ejecución directa de comandos (para input de teclado)
 *
 * El routing de comandos está delegado a commandRouter.ts (SRP).
 * La UI (TerminalBody, etc.) nunca conoce la lógica interna.
 */
import { useState, useEffect, useRef } from "preact/hooks";

import type { OutputItem, OutputItemType, AsciiData } from "../../types/data";
import { useWindowSize, getDeviceType } from "./useWindowSize";
import { resolveCommand, AVAILABLE_COMMANDS } from "../commandRouter";

import asciiJson from "../../data/ascii.json";

const ascii = asciiJson as AsciiData;

/**
 * Selecciona el banner ASCII apropiado según el tipo de dispositivo.
 */
function getBannerForDevice(deviceType: "mobile" | "tablet" | "desktop"): string {
  switch (deviceType) {
    case "mobile":
      return ascii.bannerMobile;
    case "tablet":
      return ascii.bannerTablet;
    default:
      return ascii.bannerDesktop;
  }
}

interface UseTerminalOptions {
  isL4tentMode?: boolean;
  toggleL4tent?: () => void;
}

export function useTerminal(options: UseTerminalOptions = {}) {
  const { isL4tentMode = false, toggleL4tent } = options;
  /**
   * Hook reactivo para tamaño de ventana.
   */
  const { width } = useWindowSize();
  const deviceType = getDeviceType(width);

  /**
   * Estado principal de la terminal.
   */
  const [output, setOutput] = useState<OutputItem[]>([
    { type: "raw", content: getBannerForDevice(deviceType) },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [isTypingCommand, setIsTypingCommand] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  /**
   * Historial de comandos del usuario.
   * Permite navegar con ↑↓ en el input.
   */
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  /**
   * Ref para trackear si el usuario ha interactuado.
   */
  const hasInteractedRef = useRef(false);

  /**
   * Efecto para actualizar el banner cuando cambia el tamaño de pantalla.
   */
  useEffect(() => {
    if (!hasInteractedRef.current) {
      setOutput([{ type: "raw", content: getBannerForDevice(deviceType) }]);
    }
  }, [deviceType]);

  /**
   * Limpia la terminal completamente.
   */
  function clear(): void {
    setOutput([]);
  }

  /**
   * Añade una nueva línea al historial.
   */
  function print(text: string, type: OutputItemType = "html"): void {
    setOutput((prev) => [...prev, { type, content: text }]);
  }

  /**
   * Partes del prompt HTML (DRY).
   * Se separan para reutilizar en buildPromptHtml y typeCommand.
   */
  const PROMPT_START =
    `<div class="font-mono text-sm leading-tight">` +
    `<div class="text-[var(--accent)]">` +
    `┌──(<span class="text-[var(--white-soft)]">air</span>` +
    `<span class="text-[var(--accent-soft)]">㉿</span>` +
    `<span class="text-[var(--white-soft)]">portfolio</span>)-[` +
    `<span class="text-[var(--white-soft)]">~</span>]</div>` +
    `<div class="flex items-center">` +
    `<span class="text-[var(--accent)]">└─$</span>` +
    `<span class="ml-2 text-[var(--white-soft)]">`;
  const PROMPT_END = `</span></div></div>`;

  /**
   * Genera el HTML del prompt con un comando escrito.
   * Se usa para mostrar lo que el usuario escribió antes del output.
   */
  function buildPromptHtml(cmd: string): string {
    return PROMPT_START + cmd + PROMPT_END;
  }

  /**
   * Animación de escritura del comando.
   * Se usa cuando el usuario hace clic en un botón del header/menú.
   */
  async function typeCommand(cmd: string): Promise<void> {
    setIsTyping(true);
    setIsTypingCommand(true);

    setOutput((prev) => [...prev, { type: "html", content: PROMPT_START + PROMPT_END }]);

    for (let i = 0; i < cmd.length; i++) {
      const typed = cmd.slice(0, i + 1);
      setOutput((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          type: "html",
          content: PROMPT_START + typed + PROMPT_END,
        };
        return updated;
      });
      await new Promise((res) => setTimeout(res, 40));
    }
    setIsTyping(false);
    setIsTypingCommand(false);
  }

  /**
   * Ejecuta el router de comandos con los callbacks de esta terminal.
   */
  function runResolve(cmd: string): void {
    resolveCommand(
      cmd,
      {
        print: (text: string) => {
          print(text);
        },
        clear,
        toggleL4tent,
      },
      { isL4tentMode }
    );
  }

  /**
   * Ejecuta un comando desde botones del header/menú.
   * Limpia la terminal y ejecuta animación de typing.
   */
  async function runCommand(cmd: string): Promise<void> {
    setHasInteracted(true);
    hasInteractedRef.current = true;

    // Añadir al historial si no está vacío
    if (cmd.trim() !== "") {
      setCommandHistory((prev) => [...prev, cmd.trim()]);
    }

    clear();
    await typeCommand(cmd);
    runResolve(cmd);
  }

  /**
   * Ejecuta un comando escrito por el usuario en el input real.
   * NO limpia la terminal, NO anima typing.
   * Añade el prompt con el comando al output y luego el resultado.
   */
  function executeUserCommand(cmd: string): void {
    setHasInteracted(true);
    hasInteractedRef.current = true;

    const trimmedCmd = cmd.trim();

    // Añadir al historial si no está vacío
    if (trimmedCmd !== "") {
      setCommandHistory((prev) => [...prev, trimmedCmd]);
    }

    // Mostrar el prompt con lo que escribió el usuario
    print(buildPromptHtml(trimmedCmd), "html");

    // Si es "clear", limpiar todo (sin mostrar el prompt previo)
    if (trimmedCmd === "clear") {
      clear();
      return;
    }

    // Ejecutar el comando
    runResolve(trimmedCmd);
  }

  // API pública del hook
  return {
    output,
    isTyping,
    isTypingCommand,
    hasInteracted,
    commandHistory,
    availableCommands: AVAILABLE_COMMANDS,
    runCommand,
    executeUserCommand,
    clear,
  };
}
