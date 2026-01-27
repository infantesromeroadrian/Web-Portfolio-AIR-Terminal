/**
 * Formateadores para el sistema de proyectos.
 *
 * Comandos: ls projects/, cat projects/X.txt
 */

import type { ProyectosData, ProyectoItem } from "../../../types/data";

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
    const fileName = `<span style="color:#00ff00">${proyecto.archivo}</span>`;
    const score = `<span style="color:#ffff66">${proyecto.score}</span>`;
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
