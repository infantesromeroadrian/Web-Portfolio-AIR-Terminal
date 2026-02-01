/**
 * Formateadores para secciones del portfolio.
 *
 * Funciones puras que transforman datos JSON (texto plano) en HTML
 * para: whoami, perfil, estudios, experiencia, skills,
 * certificaciones y contacto.
 *
 * REGLA: Los JSON nunca contienen HTML. Toda la presentación se genera aquí.
 */

import type {
  IconItem,
  WhoamiData,
  EstudiosData,
  EstudioItem,
  ExperienciaData,
  ExperienciaItem,
  StackGroup,
  SkillsData,
  SkillCategoria,
  CertificacionesData,
  CertificacionObtenida,
  CertificacionEnPreparacion,
  CertificacionObjetivo,
} from "../../../types/data";

import { colorIcon, linkify } from "./helpers";

// ── Helpers de presentación ─────────────────────────────────

/** Colorea un título de sección en amarillo */
function sectionTitle(title: string): string {
  return `<span style="color:#fffd00">=== ${title.toUpperCase()} ===</span>`;
}

/** Colorea texto en azul (accent) */
function accent(text: string): string {
  return `<span style="color:#2563eb">${text}</span>`;
}

/** Colorea texto en verde */
function green(text: string): string {
  return `<span style="color:#0fff00">${text}</span>`;
}

/** Colorea texto en rojo */
function red(text: string): string {
  return `<span style="color:#ff3333">${text}</span>`;
}

/** Colorea un ID de sección en azul (e.g. [01]) */
function blueId(id: string): string {
  return `<span style="color:#3399ff">${id}</span>`;
}

// =============================================================================
// WHOAMI
// =============================================================================

export function formatWhoami(data: WhoamiData): string {
  // Keywords destacados
  const text = data.text
    .replace(/AI Security Architect/g, `<span style="color:#2563eb">AI Security Architect</span>`)
    .replace(
      /Ingeniería de IA Ofensiva y Defensiva/g,
      `<span style="color:#2563eb">Ingeniería de IA Ofensiva y Defensiva</span>`
    )
    .replace(
      /Defensa en Profundidad/g,
      `<span style="color:#2563eb">Defensa en Profundidad</span>`
    );

  const specialization = data.specialization
    .map((item: IconItem) => `${colorIcon(item.icon, item.color)} ${item.text}`)
    .join("\n");

  const goals = data.goals
    .map((item: IconItem) => `${colorIcon(item.icon, item.color)} ${item.text}`)
    .join("\n");

  return `
Name: ${green(data.name)}
Role: ${accent(data.role)}

${text}

<span style="color:#2563eb">»</span> <i>"${data.quote}"</i>

${sectionTitle("SPECIALIZATION")}
${specialization}

${sectionTitle("GOALS")}
${goals}
`;
}

// =============================================================================
// ESTUDIOS
// =============================================================================

export function formatEstudios(data: EstudiosData): string {
  return `
${sectionTitle(data.title)}
${data.items
  .map(
    (item: EstudioItem) => `
${blueId(item.id)} ${item.titulo} (${item.inicio} - ${item.fin})
     • Institution: ${item.centro}
     • Location: ${item.ubicacion}
${item.temas
  .map((t: IconItem) => `     ${t.icon ? colorIcon(t.icon, t.color) : "-"} ${t.text}`)
  .join("\n")}
`
  )
  .join("\n")}
`;
}

// =============================================================================
// EXPERIENCIA
// =============================================================================

export function formatExperiencia(data: ExperienciaData): string {
  return `
${sectionTitle(data.title)}
${data.items
  .map((item: ExperienciaItem) => {
    return `
${blueId(item.id)} ${item.puesto} (${item.inicio} - ${item.fin})
     • Company: ${red(item.empresa)}
     • Location: ${item.ubicacion}

     • Responsibilities:
${item.responsabilidades
  .map((r: IconItem) => `     ${r.icon ? colorIcon(r.icon, r.color) : "-"} ${r.text}`)
  .join("\n")}

     • Achievements:
${item.logros.map((l: IconItem) => `     ${colorIcon(l.icon, l.color)} ${l.text}`).join("\n")}

     • Stack:
${item.stackGroups
  .map(
    (group: StackGroup) =>
      `     ${colorIcon(group.icon, group.color)} ${group.title}: ${group.items.join(", ")}`
  )
  .join("\n")}
`;
  })
  .join("\n")}
`;
}

// =============================================================================
// SKILLS
// =============================================================================

export function formatSkills(data: SkillsData): string {
  return `
${sectionTitle(data.title)}
${data.categorias
  .map(
    (cat: SkillCategoria) => `
${cat.nombre}
${cat.items
  .map((i: IconItem) => `${i.icon ? colorIcon(i.icon, i.color) : "-"} ${i.text}`)
  .join("\n")}
`
  )
  .join("\n")}
`;
}

// =============================================================================
// CERTIFICACIONES
// =============================================================================

export function formatCertificaciones(data: CertificacionesData): string {
  // --- OBTAINED ---
  const obtenidas = data.obtenidas.length
    ? data.obtenidas
        .map((c: CertificacionObtenida) => {
          let entry = `${colorIcon(c.icon, c.color)} ${c.nombre}`;
          if (c.anio) entry += ` (${c.anio})`;
          if (c.id) entry += `\n     - Credential ID: ${c.id}`;
          if (c.url) entry += `\n     - URL: ${linkify(c.url)}`;
          entry += `\n${c.detalles.map((d: string) => `     - ${d}`).join("\n")}\n`;
          return entry;
        })
        .join("\n")
    : "";

  // --- IN PROGRESS ---
  const enPrep = data.enPreparacion.length
    ? data.enPreparacion
        .map(
          (c: CertificacionEnPreparacion) => `${colorIcon(c.icon, c.color)} ${c.nombre}
     - Progress: ${c.progreso}
${c.detalles.map((d: string) => `     - ${d}`).join("\n")}
`
        )
        .join("\n")
    : "";

  // --- FUTURE GOALS ---
  const objetivos = data.objetivos.length
    ? data.objetivos
        .map(
          (c: CertificacionObjetivo) => `${colorIcon(c.icon, c.color)} ${c.nombre}
`
        )
        .join("\n")
    : "";

  // --- DYNAMIC OUTPUT BUILD ---
  let output = `
${sectionTitle(data.title)}
`;

  if (obtenidas) {
    output += `
• Obtained:
${obtenidas}
`;
  }

  if (enPrep) {
    output += `
• In Progress:
${enPrep}
`;
  }

  if (objetivos) {
    output += `
• Future Goals:
${objetivos}
`;
  }

  return output;
}
