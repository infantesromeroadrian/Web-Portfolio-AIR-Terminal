/**
 * Utilidad de sanitización HTML.
 *
 * Este módulo proporciona una capa de seguridad para todo el HTML
 * que se renderiza dinámicamente en la terminal.
 *
 * Aunque actualmente los datos vienen de JSON internos controlados,
 * esta práctica:
 *  - Previene vulnerabilidades XSS si el proyecto escala
 *  - Demuestra buenas prácticas de seguridad
 *  - Facilita auditorías de código
 *
 * Decisiones de diseño:
 *  - Se permite un subset controlado de HTML (spans, links, etc.)
 *  - Se bloquean scripts, eventos inline y atributos peligrosos
 *  - La configuración es explícita para máxima claridad
 */

import DOMPurify from "dompurify";

/**
 * Configuración de DOMPurify.
 *
 * ALLOWED_TAGS: elementos HTML permitidos
 * ALLOWED_ATTR: atributos permitidos
 *
 * Esta configuración es restrictiva por defecto:
 *  - Solo se permiten elementos de formato básico
 *  - Los enlaces solo pueden tener href, target y style
 *  - No se permiten eventos inline (onclick, onerror, etc.)
 */
const ALLOWED_TAGS = ["span", "a", "br", "div", "i", "b", "strong", "em", "pre", "code"];
const ALLOWED_ATTR = ["href", "target", "style", "class"];

/**
 * Sanitiza HTML para uso seguro en dangerouslySetInnerHTML.
 *
 * @param dirty - HTML potencialmente peligroso
 * @returns HTML sanitizado seguro para renderizar
 *
 * @example
 * ```tsx
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
 * ```
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
