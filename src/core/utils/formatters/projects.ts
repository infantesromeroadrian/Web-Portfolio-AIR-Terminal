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

    const demoLink = proyecto.demo
      ? `\n     → <a href="${proyecto.demo}" target="_blank" rel="noopener noreferrer" style="color:#00ff00">🚀 Live Demo</a>`
      : "";

    return `  ${slugName} [${score}]
     ${proyecto.descripcion}
     → ${githubLink}${demoLink}
`;
  });

  return `
<span style="color:#3399ff">=== PROJECTS ===</span>

${lines.join("\n")}
<span style="color:#888888">Use 'cat proyectos/&lt;name&gt;.txt' for details (e.g.: cat proyectos/watchdogs.txt)</span>
`;
}

/**
 * Formateador para detalle de un proyecto (comando: cat projects/X.txt)
 */
export function formatProjectDetail(proyecto: ProyectoItem): string {
  const header = `<span style="color:#3399ff">=== ${proyecto.nombre.toUpperCase()} ===</span>`;
  const estado = `<span style="color:#00ff00">Status:</span> ${proyecto.estado} | <span style="color:#ffff66">Score:</span> ${proyecto.score}`;

  const detalles = proyecto.detalles
    .map((d) => `<span style="color:#00ff00">[+]</span> ${d}`)
    .join("\n");

  const stack = `<span style="color:#ff9900">Stack:</span> ${proyecto.stack.join(", ")}`;

  const github = `<span style="color:#3399ff">GitHub:</span> <a href="${proyecto.github}" target="_blank" style="color:#3399ff">${proyecto.github}</a>`;

  const demo = proyecto.demo
    ? `\n<span style="color:#00ff00">Demo:</span>  <a href="${proyecto.demo}" target="_blank" style="color:#00ff00">🚀 ${proyecto.demo}</a>`
    : "";

  return `
${header}
${estado}

${proyecto.descripcion}

${detalles}

${stack}

${github}${demo}
`;
}

/**
 * Mensaje de error cuando no se encuentra un proyecto.
 */
export function formatProjectNotFound(slug: string): string {
  return `<span style="color:#ff3333">Error:</span> Project '${slug}' not found

Available projects:
  - <span style="color:#00ff00">hospital</span>
  - <span style="color:#00ff00">bankfraud</span>
  - <span style="color:#00ff00">watchdogs</span>
  - <span style="color:#00ff00">threatintel</span>
  - <span style="color:#00ff00">siem</span>
  - <span style="color:#00ff00">emailthreat</span>

Use '<span style="color:#3399ff">proyectos</span>' to see the full list.
`;
}
