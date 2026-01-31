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
  ContactItem,
  WhoamiData,
  PerfilData,
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
  ContactoData,
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

/** Genera un enlace HTML clicable */
function link(url: string, label: string): string {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#3399ff">${label}</a>`;
}

// =============================================================================
// WHOAMI
// =============================================================================

export function formatWhoami(data: WhoamiData): string {
  // Highlight keywords in the text
  const text = data.text
    .replace(/AI Security Architect/g, accent("AI Security Architect"))
    .replace(
      /Ingeniería de IA Ofensiva y Defensiva/g,
      accent("Ingeniería de IA Ofensiva y Defensiva")
    )
    .replace(/Defensa en Profundidad/g, accent("Defensa en Profundidad"))
    .replace(/"([^"]+)"/g, `<span style="color:#2563eb">»</span> <i>"$1"</i>`);

  return `
Nombre: ${green(data.name)}
Rol: ${accent(data.role)}

${text}
`;
}

// =============================================================================
// PERFIL
// =============================================================================

export function formatPerfil(data: PerfilData): string {
  // Highlight role in description
  const description = data.description.replace(
    /AI Security Architect/g,
    accent("AI Security Architect")
  );

  const specialization = data.specialization
    .map((item: IconItem) => `${colorIcon(item.icon, item.color)} ${item.text}`)
    .join("\n");

  const goals = data.goals
    .map((item: IconItem) => `${colorIcon(item.icon, item.color)} ${item.text}`)
    .join("\n");

  return `
${sectionTitle(data.title)}

${description}

=== ESPECIALIZACIÓN ===
${specialization}

=== OBJETIVOS ===
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
     • Centro: ${item.centro}
     • Ubicación: ${item.ubicacion}
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
     • Empresa: ${red(item.empresa)}
     • Ubicación: ${item.ubicacion}

     • Responsabilidades:
${item.responsabilidades
  .map((r: IconItem) => `     ${r.icon ? colorIcon(r.icon, r.color) : "-"} ${r.text}`)
  .join("\n")}

     • Logros:
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
  // --- OBTENIDAS ---
  const obtenidas = data.obtenidas.length
    ? data.obtenidas
        .map((c: CertificacionObtenida) => {
          let entry = `${colorIcon(c.icon, c.color)} ${c.nombre}`;
          if (c.anio) entry += ` (${c.anio})`;
          if (c.id) entry += `\n     - ID Credencial: ${c.id}`;
          if (c.url) entry += `\n     - URL: ${linkify(c.url)}`;
          entry += `\n${c.detalles.map((d: string) => `     - ${d}`).join("\n")}\n`;
          return entry;
        })
        .join("\n")
    : "";

  // --- EN PREPARACIÓN ---
  const enPrep = data.enPreparacion.length
    ? data.enPreparacion
        .map(
          (c: CertificacionEnPreparacion) => `${colorIcon(c.icon, c.color)} ${c.nombre}
     - Progreso: ${c.progreso}
${c.detalles.map((d: string) => `     - ${d}`).join("\n")}
`
        )
        .join("\n")
    : "";

  // --- OBJETIVOS FUTUROS ---
  const objetivos = data.objetivos.length
    ? data.objetivos
        .map(
          (c: CertificacionObjetivo) => `${colorIcon(c.icon, c.color)} ${c.nombre}
`
        )
        .join("\n")
    : "";

  // --- CONSTRUCCIÓN FINAL DINÁMICA ---
  let output = `
${sectionTitle(data.title)}
`;

  if (obtenidas) {
    output += `
• Obtenidas:
${obtenidas}
`;
  }

  if (enPrep) {
    output += `
• En preparación:
${enPrep}
`;
  }

  if (objetivos) {
    output += `
• Objetivos futuros:
${objetivos}
`;
  }

  return output;
}

// =============================================================================
// CONTACTO
// =============================================================================

export function formatContacto(data: ContactoData): string {
  const contacto = data.items
    .map((i: ContactItem) => {
      const icon = i.icon ? colorIcon(i.icon, i.color) + " " : "- ";
      const value = i.href ? link(i.href, i.value) : i.value;
      return `${icon}${i.label}: ${value}`;
    })
    .join("\n");

  const disponibilidad = data.disponibilidad
    .map((d: IconItem) => `${colorIcon(d.icon, d.color)} ${d.text}`)
    .join("\n");

  const idiomas = data.idiomas
    .map((i: IconItem) => `${colorIcon(i.icon, i.color)} ${i.text}`)
    .join("\n");

  return `
${sectionTitle(data.title)}
${contacto}

=== DISPONIBILIDAD ===
${disponibilidad}

=== IDIOMAS ===
${idiomas}
`;
}
