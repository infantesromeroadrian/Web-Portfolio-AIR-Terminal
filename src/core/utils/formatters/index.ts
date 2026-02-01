/**
 * Barrel export para todos los formateadores.
 *
 * Permite que los consumidores sigan importando desde
 * "../utils/formatters" sin cambiar sus imports.
 */

export { colorIcon, sectionSeparator, textToHtml, linkify } from "./helpers";

export {
  formatWhoami,
  formatPerfil,
  formatEstudios,
  formatExperiencia,
  formatSkills,
  formatCertificaciones,
  formatContacto,
} from "./portfolio";

export { formatLsProjects, formatProjectDetail, formatProjectNotFound } from "./projects";

export {
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
} from "./security";
