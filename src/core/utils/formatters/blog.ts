/**
 * Formateadores para el blog.
 *
 * Comandos: blog (lista posts), cat blog/<slug>.md (detalle post)
 */

import type { BlogData, BlogPost } from "../../../types/data";

/**
 * Formatea la lista de posts del blog.
 */
export function formatBlogList(data: BlogData): string {
  const header = `
<span style="color:#3399ff">╔══════════════════════════════════════════════════════════════╗</span>
<span style="color:#3399ff">║                    BLOG — AI SECURITY RESEARCH               ║</span>
<span style="color:#3399ff">╚══════════════════════════════════════════════════════════════╝</span>
`;

  const postsFormatted = data.posts
    .map((post) => {
      const tags = post.tags.map((t) => `<span style="color:#00e5cc">[${t}]</span>`).join(" ");
      const fecha = `<span style="color:#888888">${post.fecha}</span>`;

      return `
<span style="color:#00ff00">▶</span> <span style="color:#ffff66; font-weight:bold">${post.titulo}</span>
  ${fecha} ${tags}
  <span style="color:#cccccc">${post.resumen}</span>
  <span style="color:#888888">→ cat blog/${post.slug}.md</span>
`;
    })
    .join("\n");

  const footer = `
<span style="color:#888888">─────────────────────────────────────────────────────────────────</span>
<span style="color:#888888">Usa </span><span style="color:#00ff00">cat blog/&lt;slug&gt;.md</span><span style="color:#888888"> para leer un post completo.</span>
`;

  return header + postsFormatted + footer;
}

/**
 * Formatea un post individual del blog.
 */
export function formatBlogPost(post: BlogPost): string {
  const tags = post.tags.map((t) => `<span style="color:#00e5cc">[${t}]</span>`).join(" ");

  const header = `
<span style="color:#3399ff">╔══════════════════════════════════════════════════════════════╗</span>
<span style="color:#ffff66; font-weight:bold">  ${post.titulo}</span>
<span style="color:#3399ff">╚══════════════════════════════════════════════════════════════╝</span>

<span style="color:#888888">Fecha:</span> ${post.fecha}  ${tags}
`;

  // Renderizar imagen si existe
  const imagen = post.imagen
    ? `
<div style="margin: 16px 0; text-align: center;">
  <img src="${post.imagen}" alt="${post.titulo}" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #333;" />
</div>
`
    : "";

  // Procesar contenido markdown-lite
  const contenido = post.contenido
    .map((linea) => {
      // Headers
      if (linea.startsWith("## ")) {
        return `\n<span style="color:#3399ff; font-weight:bold">${linea.replace("## ", "━━ ").toUpperCase()}</span>\n`;
      }
      if (linea.startsWith("### ")) {
        return `\n<span style="color:#00e5cc; font-weight:bold">${linea.replace("### ", "▸ ")}</span>`;
      }
      // Code blocks
      if (linea === "```" || linea.startsWith("```")) {
        return `<span style="color:#555555">────────────────────────────────────────</span>`;
      }
      // Bold
      if (linea.includes("**")) {
        return linea.replace(/\*\*([^*]+)\*\*/g, '<span style="color:#ffff66">$1</span>');
      }
      // Bullet points
      if (linea.startsWith("- ")) {
        return `  <span style="color:#00ff00">•</span> ${linea.substring(2)}`;
      }
      // Empty lines
      if (linea === "") {
        return "";
      }
      // Regular text
      return `<span style="color:#cccccc">${linea}</span>`;
    })
    .join("\n");

  const footer = `

<span style="color:#888888">─────────────────────────────────────────────────────────────────</span>
<span style="color:#888888">Escribe </span><span style="color:#00ff00">blog</span><span style="color:#888888"> para volver a la lista de posts.</span>
`;

  return header + imagen + contenido + footer;
}

/**
 * Mensaje cuando no se encuentra un post.
 */
export function formatBlogPostNotFound(slug: string): string {
  return `
<span style="color:#ff3333">[ERROR]</span> Post no encontrado: <span style="color:#ffff66">${slug}</span>

<span style="color:#888888">Posts disponibles:</span>
<span style="color:#888888">  → Usa el comando </span><span style="color:#00ff00">blog</span><span style="color:#888888"> para ver la lista completa.</span>
`;
}
