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
  // Comandos principales (coherentes con labels de navegación)
  "whoami",
  "perfil",
  "estudios",
  "experiencia",
  "skills",
  "certificaciones",
  "proyectos",
  "contacto",
  // Alias estilo terminal (cat archivo.txt)
  "cat perfil.txt",
  "cat estudios.txt",
  "cat experiencia.txt",
  "cat skills.txt",
  "cat certificaciones.txt",
  "cat contacto.txt",
  // Utilidades
  "help",
  "clear",
  "neofetch",
  "all",
  // Proyectos específicos
  "ls proyectos",
  "cat proyectos/hospital.txt",
  "cat proyectos/bankfraud.txt",
  "cat proyectos/watchdogs.txt",
  "cat proyectos/threatintel.txt",
  "cat proyectos/siem.txt",
  "cat proyectos/emailthreat.txt",
  // Easter eggs & Security commands
  "nmap",
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
  // Comandos principales (coherentes con labels)
  whoami: ({ print }) => {
    print(formatWhoami(whoami));
  },
  perfil: ({ print }) => {
    print(formatPerfil(perfil));
  },
  estudios: ({ print }) => {
    print(formatEstudios(estudios));
  },
  experiencia: ({ print }) => {
    print(formatExperiencia(experiencia));
  },
  skills: ({ print }) => {
    print(formatSkills(skills));
  },
  certificaciones: ({ print }) => {
    print(formatCertificaciones(certificaciones));
  },
  proyectos: ({ print }) => {
    print(formatLsProjects(proyectos));
  },
  contacto: ({ print }) => {
    print(formatContacto(contacto));
  },
  // Alias estilo terminal (cat archivo.txt)
  "cat perfil.txt": ({ print }) => {
    print(formatPerfil(perfil));
  },
  "cat estudios.txt": ({ print }) => {
    print(formatEstudios(estudios));
  },
  "cat experiencia.txt": ({ print }) => {
    print(formatExperiencia(experiencia));
  },
  "cat skills.txt": ({ print }) => {
    print(formatSkills(skills));
  },
  "cat certificaciones.txt": ({ print }) => {
    print(formatCertificaciones(certificaciones));
  },
  "cat contacto.txt": ({ print }) => {
    print(formatContacto(contacto));
  },
  // Utilidades
  help: ({ print }) => {
    print(formatHelp(AVAILABLE_COMMANDS));
  },
  clear: ({ clear }) => {
    clear();
  },
  neofetch: ({ print }) => {
    print(formatNeofetch());
  },
  all: ({ print }) => {
    print(generateAllInfo());
  },
  // Proyectos
  "ls proyectos": ({ print }) => {
    print(formatLsProjects(proyectos));
  },
  "cat proyectos/hospital.txt": ({ print }) => {
    print(formatProjectDetail(proyectos.hospital));
  },
  "cat proyectos/bankfraud.txt": ({ print }) => {
    print(formatProjectDetail(proyectos.bankfraud));
  },
  "cat proyectos/watchdogs.txt": ({ print }) => {
    print(formatProjectDetail(proyectos.watchdogs));
  },
  "cat proyectos/threatintel.txt": ({ print }) => {
    print(formatProjectDetail(proyectos.threatintel));
  },
  "cat proyectos/siem.txt": ({ print }) => {
    print(formatProjectDetail(proyectos.siem));
  },
  "cat proyectos/emailthreat.txt": ({ print }) => {
    print(formatProjectDetail(proyectos.emailthreat));
  },
  // Easter eggs & Security commands
  nmap: ({ print }) => {
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

  // Comandos dinámicos: cat proyectos/<nombre>.txt
  if (trimmed.startsWith("cat proyectos/") && trimmed.endsWith(".txt")) {
    const slug = trimmed.replace("cat proyectos/", "").replace(".txt", "").trim();

    if (slug in proyectos) {
      actions.print(formatProjectDetail(proyectos[slug]));
    } else {
      actions.print(formatProjectNotFound(slug));
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
