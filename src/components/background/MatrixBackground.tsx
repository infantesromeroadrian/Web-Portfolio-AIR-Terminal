/**
 * Fondo animado estilo "Neural Rain" usando <canvas>.
 *
 * Este componente:
 *  - Renderiza un efecto de caída de caracteres ML/AI en bucle
 *  - Símbolos: λ, ∑, ∂, θ, σ, ∇, ⊗, ∫, π, 01, α, β, γ, δ, ε, η
 *  - Se ejecuta completamente fuera del árbol de renderizado de Preact
 *  - No provoca re-renders (usa canvas imperativo)
 *  - Responde a resize de ventana (recalcula columnas y drops)
 *
 * Decisiones de diseño:
 *  - Canvas imperativo para máximo rendimiento
 *  - Resize con debounce de 200ms para evitar thrashing
 *  - pointer-events-none evita interferencias con la UI
 *  - blur ligero para elegancia sin distracción
 *  - Variación de color simula "activación neuronal"
 */

import { useEffect, useRef } from "preact/hooks";

const LETTERS = "λ∑∂θσ∇⊗∫π01αβγδεη";
const FONT_SIZE = 14;
const FRAME_INTERVAL_MS = 50; // ~20 FPS — used for rate-limiting rAF
const RESIZE_DEBOUNCE = 200;

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;

    // Non-null aliases for use inside closures (early return guarantees non-null)
    const cvs = canvasEl;
    const ctx = ctxEl;

    /**
     * Estado mutable de la animación.
     * Se recalcula en cada resize.
     */
    let columns = 0;
    let drops: number[] = [];

    function resize() {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;

      const newColumns = Math.floor(cvs.width / FONT_SIZE);

      if (newColumns !== columns) {
        // Preservar posiciones existentes, añadir nuevas si crece
        const newDrops = Array(newColumns)
          .fill(0)
          .map((_, i) =>
            i < drops.length ? drops[i] : Math.floor((Math.random() * cvs.height) / FONT_SIZE)
          );
        drops = newDrops;
        columns = newColumns;
      }
    }

    // Inicializar
    resize();

    /**
     * Resize con debounce para evitar recalcular en cada pixel.
     */
    let resizeTimeout: number | undefined;
    function handleResize() {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, RESIZE_DEBOUNCE);
    }

    window.addEventListener("resize", handleResize);

    /**
     * Función principal de dibujo.
     */
    function draw() {
      // Fondo semitransparente → efecto de "rastro" Matrix
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      ctx.font = `${FONT_SIZE}px monospace`;

      drops.forEach((y, i) => {
        const text = LETTERS[Math.floor(Math.random() * LETTERS.length)];

        /**
         * Efecto de "activación neuronal":
         *  - 10%: brillo cian intenso (neurona activada)
         *  - 20%: azul brillante
         *  - 70%: azul base
         */
        const rand = Math.random();
        if (rand > 0.9) {
          ctx.fillStyle = "#22d3ee";
        } else if (rand > 0.7) {
          ctx.fillStyle = "#60a5fa";
        } else {
          ctx.fillStyle = "#2563eb";
        }

        ctx.fillText(text, i * FONT_SIZE, y * FONT_SIZE);

        // Reinicio aleatorio cuando sale de pantalla
        if (y * FONT_SIZE > cvs.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      });
    }

    // requestAnimationFrame with frame-rate limiting (~20fps)
    // Auto-pauses when tab is hidden → battery-friendly
    let animId: number;
    let lastFrame = 0;

    function loop(timestamp: number) {
      animId = requestAnimationFrame(loop);
      if (timestamp - lastFrame < FRAME_INTERVAL_MS) return;
      lastFrame = timestamp;
      draw();
    }
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      class="fixed inset-0 pointer-events-none blur-[1.3px]"
      style="z-index:1; opacity:0.25"
    />
  );
}
