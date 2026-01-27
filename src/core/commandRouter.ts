/**
 * Router de comandos de la terminal.
 *
 * Responsabilidad única: dado un comando string, ejecuta la acción correspondiente.
 * No conoce React/Preact, hooks, ni estado — recibe callbacks puros.
 *
 * Esto permite:
 *  - Testear los comandos sin montar componentes
 *  - Añadir nuevos comandos sin tocar useTerminal
 *  - Mantener useTerminal como orquestador, no como God Object
 */

import type {
  WhoamiData,
  PerfilData,
  EstudiosData,
  ExperienciaData,
  SkillsData,
  CertificacionesData,
  ContactoData,
  ProyectosData,
} from "../types/data";

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
  formatNmap,
  formatSudoRm,
  formatHack,
  formatExploit,
  formatCurl,
  formatThreatMap,
  formatCve,
  formatDemo,
  sectionSeparator,
  textToHtml,
} from "./utils/formatters";

// ── Datos estáticos ─────────────────────────────────────────
import whoamiJson from "../data/whoami.json";
import perfilJson from "../data/perfil.json";
import estudiosJson from "../data/estudios.json";
import experienciaJson from "../data/experiencia.json";
import skillsJson from "../data/skills.json";
import certificacionesJson from "../data/certificaciones.json";
import contactoJson from "../data/contacto.json";
import proyectosJson from "../data/proyectos.json";

const whoami = whoamiJson as WhoamiData;
const perfil = perfilJson as PerfilData;
const estudios = estudiosJson as EstudiosData;
const experiencia = experienciaJson as ExperienciaData;
const skills = skillsJson as SkillsData;
const certificaciones = certificacionesJson as CertificacionesData;
const contacto = contactoJson as ContactoData;
const proyectos = proyectosJson as ProyectosData;

// ── Comandos disponibles ────────────────────────────────────

export const AVAILABLE_COMMANDS: string[] = [
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
  // Easter eggs & Security commands
  "nmap localhost",
  "sudo rm -rf /",
  "hack",
  "exploit",
  "curl",
  "threat-map",
  "cve",
  "demo",
];

// ── Tipo del mapa de comandos ───────────────────────────────

interface TerminalActions {
  print: (text: string) => void;
  clear: () => void;
}

type CommandHandler = (actions: TerminalActions) => void;

// ── "All info" compuesto ────────────────────────────────────

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

// ── Mapa de comandos (O(1) lookup vs switch O(n)) ───────────

const COMMAND_MAP: Record<string, CommandHandler> = {
  whoami: ({ print }) => {
    print(formatWhoami(whoami));
  },
  help: ({ print }) => {
    print(formatHelp(AVAILABLE_COMMANDS));
  },
  clear: ({ clear }) => {
    clear();
  },
  neofetch: ({ print }) => {
    print(formatNeofetch());
  },
  "cat profile.txt": ({ print }) => {
    print(formatPerfil(perfil));
  },
  "cat edu.txt": ({ print }) => {
    print(formatEstudios(estudios));
  },
  "cat exp.txt": ({ print }) => {
    print(formatExperiencia(experiencia));
  },
  "cat skills.txt": ({ print }) => {
    print(formatSkills(skills));
  },
  "cat certs.txt": ({ print }) => {
    print(formatCertificaciones(certificaciones));
  },
  "cat contact.txt": ({ print }) => {
    print(formatContacto(contacto));
  },
  "whoami && cat *.txt": ({ print }) => {
    print(generateAllInfo());
  },
  "ls projects/": ({ print }) => {
    print(formatLsProjects(proyectos));
  },
  // Easter eggs & Security commands
  "nmap localhost": ({ print }) => {
    print(formatNmap());
  },
  "sudo rm -rf /": ({ print }) => {
    print(formatSudoRm());
  },
  hack: ({ print }) => {
    print(formatHack());
  },
  exploit: ({ print }) => {
    print(formatExploit());
  },
  curl: ({ print }) => {
    print(formatCurl());
  },
  "threat-map": ({ print }) => {
    print(formatThreatMap());
  },
  cve: ({ print }) => {
    print(formatCve());
  },
  demo: ({ print }) => {
    print(formatDemo());
  },
};

// ── Router público ──────────────────────────────────────────

/**
 * Resuelve un comando y ejecuta la acción correspondiente.
 *
 * @param cmd - Comando tal como lo escribió el usuario (se trimmea internamente)
 * @param actions - Callbacks de la terminal (print, clear)
 */
export function resolveCommand(cmd: string, actions: TerminalActions): void {
  const trimmed = cmd.trim();
  if (trimmed === "") return;

  // Comandos dinámicos: cat projects/X.txt
  if (trimmed.startsWith("cat projects/") && trimmed.endsWith(".txt")) {
    const archivo = trimmed.replace("cat projects/", "");
    const slug = archivo.replace(".txt", "");

    if (slug in proyectos) {
      actions.print(formatProjectDetail(proyectos[slug]));
    } else {
      actions.print(formatProjectNotFound(archivo));
    }
    return;
  }

  // Comandos estáticos (O(1) lookup)
  if (trimmed in COMMAND_MAP) {
    COMMAND_MAP[trimmed](actions);
    return;
  }

  // Comando no encontrado
  actions.print(
    textToHtml(`Command not found: ${trimmed}\nType 'help' to see available commands.`)
  );
}
