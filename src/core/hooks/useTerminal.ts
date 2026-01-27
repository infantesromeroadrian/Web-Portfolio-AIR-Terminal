/**
 * Hook principal que gestiona toda la lógica de la terminal.
 *
 * Este hook encapsula:
 *  - Estado del historial de salida
 *  - Historial de comandos del usuario (↑↓)
 *  - Lista de comandos disponibles (para TAB autocomplete)
 *  - Animación de escritura del comando (para botones del header)
 *  - Ejecución directa de comandos (para input de teclado)
 *  - Router de comandos (help, neofetch, clear, etc.)
 *
 * La UI (TerminalBody, TerminalPrompt, etc.) nunca conoce la lógica interna.
 * Esto sigue el principio de separación de responsabilidades (SRP - SOLID).
 */
import { useState, useEffect, useRef } from "preact/hooks";

// Importación de tipos centralizados
import type {
  OutputItem,
  OutputItemType,
  WhoamiData,
  PerfilData,
  EstudiosData,
  ExperienciaData,
  SkillsData,
  CertificacionesData,
  ContactoData,
  AsciiData,
  ProyectosData,
} from "../../types/data";

// Importación del hook de tamaño de ventana
import { useWindowSize, getDeviceType } from "./useWindowSize";

// Importación de datos estáticos (contenido mostrado en la terminal)
import whoamiJson from "../../data/whoami.json";
import perfilJson from "../../data/perfil.json";
import estudiosJson from "../../data/estudios.json";
import experienciaJson from "../../data/experiencia.json";
import skillsJson from "../../data/skills.json";
import certificacionesJson from "../../data/certificaciones.json";
import contactoJson from "../../data/contacto.json";
import asciiJson from "../../data/ascii.json";
import proyectosJson from "../../data/proyectos.json";

// Type assertions para los JSON importados
const whoami = whoamiJson as WhoamiData;
const perfil = perfilJson as PerfilData;
const estudios = estudiosJson as EstudiosData;
const experiencia = experienciaJson as ExperienciaData;
const skills = skillsJson as SkillsData;
const certificaciones = certificacionesJson as CertificacionesData;
const contacto = contactoJson as ContactoData;
const ascii = asciiJson as AsciiData;
const proyectos = proyectosJson as ProyectosData;

// Importación de formateadores (responsables de convertir JSON → HTML)
import {
  formatWhoami,
  formatPerfil,
  formatEstudios,
  formatExperiencia,
  formatSkills,
  formatCertificaciones,
  formatContacto,
  formatLsProjects,
  formatProjectDetail,
  formatProjectNotFound,
  formatHelp,
  formatNeofetch,
  sectionSeparator,
  textToHtml,
} from "../utils/formatters";

/**
 * Lista completa de comandos disponibles.
 * Se usa para:
 *  - TAB autocomplete en el input
 *  - Comando help
 *  - Validación de comandos
 */
const AVAILABLE_COMMANDS: string[] = [
  "whoami",
  "help",
  "clear",
  "neofetch",
  "cat profile.txt",
  "cat edu.txt",
  "cat exp.txt",
  "cat skills.txt",
  "cat certs.txt",
  "cat contact.txt",
  "cat projects/watchdogs.txt",
  "cat projects/threatintel.txt",
  "cat projects/siem.txt",
  "cat projects/emailthreat.txt",
  "ls projects/",
  "whoami && cat *.txt",
];

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

export function useTerminal() {
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
   * Genera el HTML del prompt con un comando escrito.
   * Se usa para mostrar lo que el usuario escribió antes del output.
   */
  function buildPromptHtml(cmd: string): string {
    return (
      `<div class="font-mono text-sm leading-tight">` +
      `<div class="text-[var(--red-accent)]">` +
      `┌──(<span class="text-[var(--white-soft)]">air</span>` +
      `<span class="text-[var(--red-soft)]">㉿</span>` +
      `<span class="text-[var(--white-soft)]">portfolio</span>)-[` +
      `<span class="text-[var(--white-soft)]">~</span>]</div>` +
      `<div class="flex items-center">` +
      `<span class="text-[var(--red-accent)]">└─$</span>` +
      `<span class="ml-2 text-[var(--white-soft)]">${cmd}</span>` +
      `</div></div>`
    );
  }

  /**
   * Animación de escritura del comando.
   * Se usa cuando el usuario hace clic en un botón del header/menú.
   */
  async function typeCommand(cmd: string): Promise<void> {
    setIsTyping(true);
    setIsTypingCommand(true);
    let typed = "";
    const promptStart =
      `<div class="font-mono text-sm leading-tight">` +
      `<div class="text-[var(--red-accent)]">` +
      `┌──(<span class="text-[var(--white-soft)]">air</span>` +
      `<span class="text-[var(--red-soft)]">㉿</span>` +
      `<span class="text-[var(--white-soft)]">portfolio</span>)-[` +
      `<span class="text-[var(--white-soft)]">~</span>]</div>` +
      `<div class="flex items-center">` +
      `<span class="text-[var(--red-accent)]">└─$</span>` +
      `<span class="ml-2 text-[var(--white-soft)]">`;
    const promptEnd = `</span></div></div>`;

    setOutput((prev) => [...prev, { type: "html", content: promptStart + promptEnd }]);

    for (let i = 0; i < cmd.length; i++) {
      typed = cmd.slice(0, i + 1);
      setOutput((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          type: "html",
          content: promptStart + typed + promptEnd,
        };
        return updated;
      });
      await new Promise((res) => setTimeout(res, 40));
    }
    setIsTyping(false);
    setIsTypingCommand(false);
  }

  /**
   * Composición del comando "ALL INFO".
   */
  function generateAllInfo(): string {
    return `
${formatWhoami(whoami)}
${sectionSeparator()}

${formatPerfil(perfil)}
${sectionSeparator()}

${formatEstudios(estudios)}
${sectionSeparator()}

${formatExperiencia(experiencia)}
${sectionSeparator()}

${formatSkills(skills)}
${sectionSeparator()}

${formatCertificaciones(certificaciones)}
${sectionSeparator()}

${formatContacto(contacto)}
`;
  }

  /**
   * Lógica central del router de comandos.
   * Ejecuta el comando y produce output, pero NO maneja la presentación
   * (clear/typing) — eso lo hacen runCommand y executeUserCommand.
   */
  function resolveCommand(cmd: string): void {
    const trimmedCmd = cmd.trim();

    if (trimmedCmd === "") {
      return;
    }

    // Manejar comandos cat projects/X.txt
    if (trimmedCmd.startsWith("cat projects/") && trimmedCmd.endsWith(".txt")) {
      const archivo = trimmedCmd.replace("cat projects/", "");
      const slug = archivo.replace(".txt", "");

      if (slug in proyectos) {
        print(formatProjectDetail(proyectos[slug]), "html");
      } else {
        print(formatProjectNotFound(archivo), "html");
      }
      return;
    }

    switch (trimmedCmd) {
      case "whoami":
        print(formatWhoami(whoami), "html");
        break;
      case "help":
        print(formatHelp(AVAILABLE_COMMANDS), "html");
        break;
      case "clear":
        clear();
        break;
      case "neofetch":
        print(formatNeofetch(), "html");
        break;
      case "cat profile.txt":
        print(formatPerfil(perfil), "html");
        break;
      case "cat edu.txt":
        print(formatEstudios(estudios), "html");
        break;
      case "cat exp.txt":
        print(formatExperiencia(experiencia), "html");
        break;
      case "cat skills.txt":
        print(formatSkills(skills), "html");
        break;
      case "cat certs.txt":
        print(formatCertificaciones(certificaciones), "html");
        break;
      case "cat contact.txt":
        print(formatContacto(contacto), "html");
        break;
      case "whoami && cat *.txt":
        print(generateAllInfo(), "html");
        break;
      case "ls projects/":
        print(formatLsProjects(proyectos), "html");
        break;
      default:
        print(
          textToHtml(`Command not found: ${trimmedCmd}\nType 'help' to see available commands.`),
          "html"
        );
    }
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
    resolveCommand(cmd);
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
    resolveCommand(trimmedCmd);
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
