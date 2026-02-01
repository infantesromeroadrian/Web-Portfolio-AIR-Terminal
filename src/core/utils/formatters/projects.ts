/**
 * Formateadores para el sistema de proyectos.
 *
 * Comandos: proyectos, proyecto <nombre>
 */

import type { ProyectosData, ProyectoItem } from "../../../types/data";

/**
 * Formateador para listar proyectos (comando: proyectos)
 */
export function formatLsProjects(data: ProyectosData): string {
  const entries = Object.entries(data);

  const lines = entries.map(([slug, proyecto]: [string, ProyectoItem]) => {
    const slugName = `<span style="color:#00ff00">${slug}</span>`;
    const score = `<span style="color:#ffff66">${proyecto.score}</span>`;
    const githubShort = proyecto.github.replace("https://github.com/", "");
    const githubLink = `<a href="${proyecto.github}" target="_blank" rel="noopener noreferrer" style="color:#3399ff">${githubShort}</a>`;

    return `  ${slugName} [${score}]
     ${proyecto.descripcion}
     → ${githubLink}
`;
  });

  return `
<span style="color:#3399ff">=== PROYECTOS ===</span>

${lines.join("\n")}
<span style="color:#888888">Usa 'cat proyectos/&lt;nombre&gt;.txt' para ver detalles (ej: cat proyectos/watchdogs.txt)</span>
`;
}

/**
 * Formateador para detalle de un proyecto (comando: cat projects/X.txt)
 */
export function formatProjectDetail(proyecto: ProyectoItem): string {
  const header = `<span style="color:#3399ff">=== ${proyecto.nombre.toUpperCase()} ===</span>`;
  const estado = `<span style="color:#00ff00">Estado:</span> ${proyecto.estado} | <span style="color:#ffff66">Score:</span> ${proyecto.score}`;

  const detalles = proyecto.detalles
    .map((d) => `<span style="color:#00ff00">[+]</span> ${d}`)
    .join("\n");

  const stack = `<span style="color:#ff9900">Stack:</span> ${proyecto.stack.join(", ")}`;

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
export function formatProjectNotFound(slug: string): string {
  return `<span style="color:#ff3333">Error:</span> No se encontró el proyecto '${slug}'

Proyectos disponibles:
  - <span style="color:#00ff00">watchdogs</span>
  - <span style="color:#00ff00">threatintel</span>
  - <span style="color:#00ff00">siem</span>
  - <span style="color:#00ff00">emailthreat</span>

Usa '<span style="color:#3399ff">proyectos</span>' para ver la lista completa.
`;
}
