/**
 * Utilidades compartidas por todos los formateadores.
 *
 * Funciones puras de bajo nivel para:
 *  - Colorear iconos
 *  - Convertir URLs en enlaces
 *  - Separadores visuales
 *  - Conversión de texto a HTML
 */

import type { IconColor } from "../../../types/data";

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
  cyan: "#00ffcc",
};

/**
 * Aplica color a un icono usando estilos inline.
 *
 * No se usa Tailwind aquí porque:
 *  - Los formateadores generan HTML dinámico
 *  - Tailwind no procesa clases generadas en tiempo de ejecución
 */
export function colorIcon(icon: string, color: IconColor): string {
  const hex = COLOR_MAP[color];
  return `<span style="color:${hex}">${icon}</span>`;
}

/**
 * Separador visual entre secciones.
 */
export function sectionSeparator(): string {
  return "-----------------------------------------";
}

/**
 * Convierte saltos de línea en <br>.
 * Se usa para mensajes RAW o errores.
 */
export function textToHtml(text: string): string {
  return text.replace(/\n/g, "<br>");
}

/**
 * Convierte URLs en enlaces HTML clicables.
 *
 * Nota: DOMPurify sanitiza el output final, pero se valida
 * que solo se procesen URLs http/https como defense in depth.
 */
export function linkify(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#3399ff">${url}</a>`
  );
}
