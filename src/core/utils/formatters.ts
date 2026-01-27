/**
 * Sistema de formateo para la terminal.
 *
 * Este archivo define funciones puras que transforman datos JSON
 * en bloques de texto/HTML listos para ser renderizados en la terminal.
 *
 * Decisiones de diseño:
 *  - Cada sección del portfolio tiene su propio formateador
 *  - Se evita mezclar lógica de UI con lógica de datos
 *  - Los formateadores devuelven strings listos para imprimir
 *  - Se permite HTML controlado para enriquecer la presentación
 *
 * Este enfoque mantiene:
 *  - Separación estricta de responsabilidades (SRP - SOLID)
 *  - Código fácil de mantener y extender
 *  - TerminalBody libre de lógica compleja
 */

import type {
  IconColor,
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
  ProyectosData,
  ProyectoItem,
} from "../../types/data";

/**
 * Mapa de colores hexadecimales para los iconos.
 * Tipado estricto con Record para garantizar cobertura de todos los colores.
 */
const COLOR_MAP: Record<IconColor, string> = {
  green: "#00ff00",
  orange: "#ff9900",
  red: "#ff3333",
  blue: "#3399ff",
  yellow: "#ffff66",
  white: "#ffffff",
};

/**
 * Aplica color a un icono usando estilos inline.
 *
 * Razón:
 *  - Los JSON contienen iconos simples (ej: [+])
 *  - Cada icono puede tener un color asociado
 *  - La terminal soporta HTML seguro, así que se usa <span>
 *
 * No se usa Tailwind aquí porque:
 *  - Los formateadores generan HTML dinámico
 *  - Tailwind no procesa clases generadas en tiempo de ejecución
 */
function colorIcon(icon: string, color: IconColor): string {
  const hex = COLOR_MAP[color];
  return `<span style="color:${hex}">${icon}</span>`;
}

/**
 * Separador visual entre secciones.
 *
 * Se mantiene simple para conservar estética de terminal.
 */
export function sectionSeparator(): string {
  return "-----------------------------------------";
}

/**
 * Formateador para WHOAMI.
 *
 * Este es el más simple: solo inserta valores del JSON.
 * Se permite HTML en name y role.
 */
export function formatWhoami(data: WhoamiData): string {
  return `
Nombre: ${data.name}
Rol: ${data.role}

${data.text}
`;
}

/**
 * Formateador para PERFIL.
 *
 * - Convierte listas de especialización y objetivos en líneas con iconos
 * - Permite HTML en títulos y descripciones
 * - Mantiene estructura clara tipo "sección"
 */
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

/**
 * Formateador para ESTUDIOS.
 *
 * - Recorre cada bloque de estudios
 * - Inserta iconos coloreados en los temas
 * - Mantiene indentación manual para simular formato CLI
 *
 * Importante:
 *  No se toca la indentación interna del template literal.
 */
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

/**
 * Formateador para EXPERIENCIA.
 *
 * - Similar a estudios, pero con responsabilidades, logros y stack
 * - Se respeta indentación manual para mantener estética CLI
 */
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

/**
 * Formateador para SKILLS.
 *
 * - Recorre categorías
 * - Inserta iconos coloreados
 * - Mantiene estructura simple y clara
 */
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

/**
 * Formateador para CERTIFICACIONES.
 *
 * - Divide en tres bloques: obtenidas, en preparación, objetivos
 * - Usa linkify para convertir URLs en enlaces clicables
 * - Mantiene indentación manual
 */
export function formatCertificaciones(data: CertificacionesData): string {
  // --- OBTENIDAS ---
  const obtenidas = data.obtenidas.length
    ? data.obtenidas
        .map(
          (c: CertificacionObtenida) => `${colorIcon(c.icon, c.color)} ${c.nombre} (${c.anio})
     - ID Credencial: ${c.id}
     - URL: ${linkify(c.url)}
${c.detalles.map((d: string) => `     - ${d}`).join("\n")}
`
        )
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

/**
 * Convierte URLs en enlaces HTML clicables.
 *
 * Razón:
 *  - Los JSON contienen URLs en texto plano
 *  - La terminal soporta HTML seguro
 *  - Esto permite abrir enlaces sin romper la estética CLI
 */
function linkify(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank" style="color:#3399ff">${url}</a>`
  );
}

/**
 * Formateador para CONTACTO.
 *
 * - Inserta iconos coloreados
 * - Convierte URLs en enlaces
 * - Mantiene estructura clara por secciones
 */
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

/**
 * Convierte saltos de línea en <br>.
 *
 * Se usa para mensajes RAW o errores.
 */
export function textToHtml(text: string): string {
  return text.replace(/\n/g, "<br>");
}

// =============================================================================
// PROYECTOS
// =============================================================================

/**
 * Formateador para listar proyectos (comando: ls projects/)
 *
 * Simula un listado de directorio estilo Unix con:
 *  - Permisos ficticios (drwxr-xr-x)
 *  - Nombre del archivo
 *  - Descripción corta y score/métrica destacada
 */
export function formatLsProjects(data: ProyectosData): string {
  const entries = Object.entries(data);

  const lines = entries.map(([, proyecto]: [string, ProyectoItem]) => {
    // Colorear el nombre del archivo en verde
    const fileName = `<span style="color:#00ff00">${proyecto.archivo}</span>`;
    // Score en amarillo para destacar
    const score = `<span style="color:#ffff66">${proyecto.score}</span>`;
    // Descripción corta (máx 40 chars)
    const desc =
      proyecto.descripcion.length > 45
        ? proyecto.descripcion.slice(0, 42) + "..."
        : proyecto.descripcion;

    return `drwxr-xr-x  ${fileName.padEnd(35)}  ${desc} [${score}]`;
  });

  return `
<span style="color:#3399ff">=== PROYECTOS ===</span>

${lines.join("\n")}

<span style="color:#888888">Usa 'cat projects/&lt;archivo&gt;' para ver detalles</span>
`;
}

/**
 * Formateador para detalle de un proyecto (comando: cat projects/X.txt)
 *
 * Muestra información completa del proyecto:
 *  - Estado y score
 *  - Descripción
 *  - Detalles técnicos (features)
 *  - Stack tecnológico
 *  - Enlace a GitHub
 */
export function formatProjectDetail(proyecto: ProyectoItem): string {
  // Header con nombre y estado
  const header = `<span style="color:#3399ff">=== ${proyecto.nombre.toUpperCase()} ===</span>`;
  const estado = `<span style="color:#00ff00">Estado:</span> ${proyecto.estado} | <span style="color:#ffff66">Score:</span> ${proyecto.score}`;

  // Detalles como bullet points verdes
  const detalles = proyecto.detalles
    .map((d) => `<span style="color:#00ff00">[+]</span> ${d}`)
    .join("\n");

  // Stack en una línea
  const stack = `<span style="color:#ff9900">Stack:</span> ${proyecto.stack.join(", ")}`;

  // GitHub como link clicable
  const github = `<span style="color:#3399ff">GitHub:</span> <a href="${proyecto.github}" target="_blank" style="color:#3399ff">${proyecto.github}</a>`;

  return `
${header}
${estado}

${proyecto.descripcion}

${detalles}

${stack}

${github}
`;
}

/**
 * Mensaje de error cuando no se encuentra un proyecto.
 */
export function formatProjectNotFound(archivo: string): string {
  return `<span style="color:#ff3333">Error:</span> No se encontró el archivo '${archivo}'

Proyectos disponibles:
  - watchdogs.txt
  - threatintel.txt
  - siem.txt
  - emailthreat.txt

Usa 'ls projects/' para ver la lista completa.
`;
}

// =============================================================================
// HELP
// =============================================================================

/**
 * Formateador para el comando help.
 *
 * Muestra todos los comandos disponibles agrupados por categoría
 * con descripción de cada uno.
 */
export function formatHelp(commands: string[]): string {
  const commandDescriptions: Record<string, string> = {
    whoami: "Muestra nombre y rol",
    help: "Muestra esta ayuda",
    clear: "Limpia la terminal",
    neofetch: "Info del sistema estilo neofetch",
    "cat profile.txt": "Perfil profesional",
    "cat edu.txt": "Formación académica",
    "cat exp.txt": "Experiencia laboral",
    "cat skills.txt": "Habilidades técnicas",
    "cat certs.txt": "Certificaciones",
    "cat contact.txt": "Datos de contacto",
    "ls projects/": "Lista de proyectos",
    "cat projects/watchdogs.txt": "Detalle WatchDogs OSINT",
    "cat projects/threatintel.txt": "Detalle Threat Intel",
    "cat projects/siem.txt": "Detalle SIEM Anomaly",
    "cat projects/emailthreat.txt": "Detalle Email Threat",
    "whoami && cat *.txt": "Muestra toda la info",
  };

  const lines = commands.map((cmd) => {
    const desc = commandDescriptions[cmd] ?? "";
    const paddedCmd = cmd.padEnd(35);
    return `  <span style="color:#00ff00">${paddedCmd}</span> <span style="color:#888888">${desc}</span>`;
  });

  return `
<span style="color:#3399ff">=== COMANDOS DISPONIBLES ===</span>

${lines.join("\n")}

<span style="color:#888888">Usa TAB para autocompletar, ↑↓ para historial</span>
`;
}

// =============================================================================
// NEOFETCH
// =============================================================================

/**
 * Formateador para el comando neofetch.
 *
 * Emula el clásico neofetch de Linux mostrando información
 * del "sistema" (en este caso, el portfolio/perfil de Adrian).
 */
export function formatNeofetch(): string {
  // ASCII art del logo (AI/Security themed)
  const logo = [
    `<span style="color:#7c3aed">     █████╗ ██╗██████╗ </span>`,
    `<span style="color:#7c3aed">    ██╔══██╗██║██╔══██╗</span>`,
    `<span style="color:#8b5cf6">    ███████║██║██████╔╝</span>`,
    `<span style="color:#8b5cf6">    ██╔══██║██║██╔══██╗</span>`,
    `<span style="color:#a78bfa">    ██║  ██║██║██║  ██║</span>`,
    `<span style="color:#a78bfa">    ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝</span>`,
  ];

  // Info del "sistema"
  const info = [
    `<span style="color:#7c3aed">air</span><span style="color:#888888">@</span><span style="color:#7c3aed">portfolio</span>`,
    `<span style="color:#888888">─────────────────────</span>`,
    `<span style="color:#7c3aed">OS:</span>      AI Security Arch v2.0`,
    `<span style="color:#7c3aed">Host:</span>    Adrian Infantes`,
    `<span style="color:#7c3aed">Kernel:</span>  Purple Team Engine`,
    `<span style="color:#7c3aed">Shell:</span>   portfolio-terminal 1.0`,
    `<span style="color:#7c3aed">Role:</span>    AI Security Architect`,
    `<span style="color:#7c3aed">DE:</span>      Neural Rain + Preact`,
    `<span style="color:#7c3aed">Theme:</span>   Purple Team [dark]`,
    `<span style="color:#7c3aed">Stack:</span>   Python, TypeScript, Docker`,
    `<span style="color:#7c3aed">ML:</span>      LangGraph, PyTorch, scikit`,
    `<span style="color:#7c3aed">Cloud:</span>   AWS, GCP, Kubernetes`,
    `<span style="color:#7c3aed">Uptime:</span>  5+ years in AI/Security`,
    ``,
    `<span style="color:#7c3aed">██</span><span style="color:#8b5cf6">██</span><span style="color:#a78bfa">██</span><span style="color:#c4b5fd">██</span><span style="color:#00ff00">██</span><span style="color:#3399ff">██</span><span style="color:#ff9900">██</span><span style="color:#ff3333">██</span>`,
  ];

  // Combinar logo e info lado a lado
  const maxLines = Math.max(logo.length, info.length);
  const lines: string[] = [];
  for (let i = 0; i < maxLines; i++) {
    const logoLine = i < logo.length ? logo[i] : "                       ";
    const infoLine = i < info.length ? info[i] : "";
    lines.push(`${logoLine}   ${infoLine}`);
  }

  return `\n${lines.join("\n")}\n`;
}
