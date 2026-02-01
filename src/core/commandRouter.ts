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
  EstudiosData,
  ExperienciaData,
  SkillsData,
  CertificacionesData,
  ProyectosData,
  BlogData,
} from "../types/data";

import {
  formatWhoami,
  formatEstudios,
  formatExperiencia,
  formatSkills,
  formatCertificaciones,
  formatLsProjects,
  formatProjectDetail,
  formatProjectNotFound,
  formatBlogList,
  formatBlogPost,
  formatBlogPostNotFound,
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
  formatDockerInspect,
  sectionSeparator,
  textToHtml,
} from "./utils/formatters";

// ── Datos estáticos ─────────────────────────────────────────
import whoamiJson from "../data/whoami.json";
import estudiosJson from "../data/estudios.json";
import experienciaJson from "../data/experiencia.json";
import skillsJson from "../data/skills.json";
import certificacionesJson from "../data/certificaciones.json";
import proyectosJson from "../data/proyectos.json";
import blogJson from "../data/blog.json";

const whoami = whoamiJson as WhoamiData;
const estudios = estudiosJson as EstudiosData;
const experiencia = experienciaJson as ExperienciaData;
const skills = skillsJson as SkillsData;
const certificaciones = certificacionesJson as CertificacionesData;
const proyectos = proyectosJson as ProyectosData;
const blog = blogJson as BlogData;

// ── Comandos disponibles ────────────────────────────────────

export const AVAILABLE_COMMANDS: string[] = [
  // Comandos principales (coherentes con labels de navegación)
  "whoami",
  "estudios",
  "experiencia",
  "skills",
  "certificaciones",
  "proyectos",
  // Alias estilo terminal (cat archivo.txt)
  "cat estudios.txt",
  "cat experiencia.txt",
  "cat skills.txt",
  "cat certificaciones.txt",
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
  // Blog
  "blog",
  "cat blog/prompt-injection-defense.md",
  "cat blog/docker-ml-security.md",
  "cat blog/langgraph-agents-production.md",
  // Easter eggs & Security commands
  "nmap",
  "sudo rm -rf /",
  "hack",
  "exploit",
  "curl",
  "threat-map",
  "cve",
  "demo",
  "docker inspect air",
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

${formatEstudios(estudios)}
${sectionSeparator()}

${formatExperiencia(experiencia)}
${sectionSeparator()}

${formatSkills(skills)}
${sectionSeparator()}

${formatCertificaciones(certificaciones)}
`;
}

// ── Mapa de comandos (O(1) lookup vs switch O(n)) ───────────

const COMMAND_MAP: Record<string, CommandHandler> = {
  // Comandos principales (coherentes con labels)
  whoami: ({ print }) => {
    print(formatWhoami(whoami));
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
  // Alias estilo terminal (cat archivo.txt)
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
  // Blog
  blog: ({ print }) => {
    print(formatBlogList(blog));
  },
  "cat blog/prompt-injection-defense.md": ({ print }) => {
    const post = blog.posts.find((p) => p.slug === "prompt-injection-defense");
    if (post) print(formatBlogPost(post));
    else print(formatBlogPostNotFound("prompt-injection-defense"));
  },
  "cat blog/docker-ml-security.md": ({ print }) => {
    const post = blog.posts.find((p) => p.slug === "docker-ml-security");
    if (post) print(formatBlogPost(post));
    else print(formatBlogPostNotFound("docker-ml-security"));
  },
  "cat blog/langgraph-agents-production.md": ({ print }) => {
    const post = blog.posts.find((p) => p.slug === "langgraph-agents-production");
    if (post) print(formatBlogPost(post));
    else print(formatBlogPostNotFound("langgraph-agents-production"));
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
  "docker inspect air": ({ print }) => {
    print(formatDockerInspect());
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

  // Comandos dinámicos: cat blog/<slug>.md
  if (trimmed.startsWith("cat blog/") && trimmed.endsWith(".md")) {
    const slug = trimmed.replace("cat blog/", "").replace(".md", "").trim();
    const post = blog.posts.find((p) => p.slug === slug);

    if (post) {
      actions.print(formatBlogPost(post));
    } else {
      actions.print(formatBlogPostNotFound(slug));
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
