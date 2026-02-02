/**
 * Barrel export para todos los formateadores.
 *
 * Permite que los consumidores sigan importando desde
 * "../utils/formatters" sin cambiar sus imports.
 */

export { colorIcon, sectionSeparator, textToHtml, linkify } from "./helpers";

export {
  formatWhoami,
  formatEstudios,
  formatExperiencia,
  formatSkills,
  formatCertificaciones,
} from "./portfolio";

export { formatLsProjects, formatProjectDetail, formatProjectNotFound } from "./projects";

export { formatBlogList, formatBlogPost, formatBlogPostNotFound } from "./blog";

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
  formatThreats,
  formatThreatsError,
} from "./security";

export type { ThreatData, ThreatsResponse } from "./security";
