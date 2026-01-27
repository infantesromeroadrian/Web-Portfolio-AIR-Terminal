/**
 * Formateadores para secciones del portfolio.
 *
 * Funciones puras que transforman datos JSON en HTML
 * para: whoami, perfil, estudios, experiencia, skills,
 * certificaciones y contacto.
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

// =============================================================================
// WHOAMI
// =============================================================================

export function formatWhoami(data: WhoamiData): string {
  return `
Nombre: ${data.name}
Rol: ${data.role}

${data.text}
`;
}

// =============================================================================
// PERFIL
// =============================================================================

export function formatPerfil(data: PerfilData): string {
  const specialization = data.specialization
    .map((item: IconItem) => `${colorIcon(item.icon, item.color)} ${item.text}`)
    .join("\n");

  const goals = data.goals
    .map((item: IconItem) => `${colorIcon(item.icon, item.color)} ${item.text}`)
    .join("\n");

  return `
=== ${data.title.toUpperCase()} ===

${data.description}

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
=== ${data.title.toUpperCase()} ===
${data.items
  .map(
    (item: EstudioItem) => `
${item.id} ${item.titulo} (${item.inicio} - ${item.fin})
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
=== ${data.title.toUpperCase()} ===
${data.items
  .map((item: ExperienciaItem) => {
    return `
${item.id} ${item.puesto} (${item.inicio} - ${item.fin})
     • Empresa: ${item.empresa}
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
=== ${data.title.toUpperCase()} ===
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
          let entry = `${colorIcon(c.icon, c.color)} ${c.nombre} (${c.anio})`;
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
=== ${data.title.toUpperCase()} ===
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
    .map(
      (i: ContactItem) =>
        `${i.icon ? colorIcon(i.icon, i.color) + " " : "- "}${i.label}: ${linkify(i.value)}`
    )
    .join("\n");

  const disponibilidad = data.disponibilidad
    .map((d: IconItem) => `${colorIcon(d.icon, d.color)} ${d.text}`)
    .join("\n");

  const idiomas = data.idiomas
    .map((i: IconItem) => `${colorIcon(i.icon, i.color)} ${i.text}`)
    .join("\n");

  return `
=== ${data.title.toUpperCase()} ===
${contacto}

=== DISPONIBILIDAD ===
${disponibilidad}

=== IDIOMAS ===
${idiomas}
`;
}
