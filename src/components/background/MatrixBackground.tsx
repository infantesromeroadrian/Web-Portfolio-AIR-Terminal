/**
 * Fondo animado estilo Matrix Reloaded - Lluvia de código.
 *
 * Este componente:
 *  - Renderiza lluvia de caracteres estilo Matrix (binario + símbolos)
 *  - Columnas con velocidades y longitudes variables
 *  - Efecto de "cabeza brillante" en cada columna
 *  - Caracteres que cambian aleatoriamente (glitch effect)
 *  - Optimizado con requestAnimationFrame throttled
 *
 * Paleta: Verde Matrix clásico con toques de cian para variedad.
 */

import { useEffect, useRef } from "preact/hooks";

// Caracteres Matrix: binario + katakana + símbolos técnicos
const MATRIX_CHARS =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン∑∂θλ∇⊗∫πσ";
const FONT_SIZE = 16;
const FRAME_INTERVAL_MS = 45; // ~22 FPS
const RESIZE_DEBOUNCE = 200;

interface Column {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  glitchTimer: number;
}

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;

    const cvs = canvasEl;
    const ctx = ctxEl;

    let columns: Column[] = [];

    function initColumns(): void {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;

      const numColumns = Math.floor(cvs.width / FONT_SIZE);
      columns = [];

      for (let i = 0; i < numColumns; i++) {
        // Solo crear columna si pasa random check (efecto de densidad variable)
        if (Math.random() > 0.3) {
          columns.push(createColumn(i * FONT_SIZE));
        }
      }
    }

    function createColumn(x: number, startFromTop = false): Column {
      const length = Math.floor(Math.random() * 15) + 8;
      const chars = Array.from(
        { length },
        () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      );

      return {
        x,
        y: startFromTop ? 0 : -Math.random() * cvs.height,
        speed: Math.random() * 2 + 1,
        length,
        chars,
        glitchTimer: Math.random() * 10,
      };
    }

    function draw(): void {
      // Fondo con fade trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      ctx.font = `${FONT_SIZE}px "Courier New", monospace`;

      columns.forEach((col) => {
        // Glitch: cambiar caracteres aleatoriamente
        col.glitchTimer -= 0.1;
        if (col.glitchTimer <= 0) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          col.glitchTimer = Math.random() * 10 + 5;
        }

        // Dibujar cada caracter de la columna
        col.chars.forEach((char, i) => {
          const y = col.y - i * FONT_SIZE;

          // No dibujar si está fuera de pantalla
          if (y < -FONT_SIZE || y > cvs.height + FONT_SIZE) return;

          // Calcular opacidad basada en posición en la columna
          const opacity = 1 - i / col.length;

          if (i === 0) {
            // Cabeza brillante - blanco/cian
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.shadowColor = "#22d3ee";
            ctx.shadowBlur = 10;
          } else if (i === 1) {
            // Segunda posición - cian brillante
            ctx.fillStyle = `rgba(34, 211, 238, ${opacity * 0.9})`;
            ctx.shadowBlur = 5;
          } else if (i < 4) {
            // Posiciones cercanas - verde brillante
            ctx.fillStyle = `rgba(34, 197, 94, ${opacity * 0.8})`;
            ctx.shadowBlur = 0;
          } else {
            // Resto de la columna - verde oscuro con fade
            const greenValue = Math.floor(150 * opacity);
            ctx.fillStyle = `rgba(0, ${greenValue}, 0, ${opacity * 0.6})`;
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, col.x, y);
        });

        // Reset shadow
        ctx.shadowBlur = 0;

        // Mover columna hacia abajo
        col.y += col.speed;

        // Reiniciar columna si sale de pantalla
        if (col.y - col.length * FONT_SIZE > cvs.height) {
          const newCol = createColumn(col.x, true);
          col.y = newCol.y;
          col.speed = newCol.speed;
          col.length = newCol.length;
          col.chars = newCol.chars;
        }
      });
    }

    // Inicializar
    initColumns();

    // Resize handler con debounce
    let resizeTimeout: number | undefined;
    function handleResize(): void {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(initColumns, RESIZE_DEBOUNCE);
    }

    window.addEventListener("resize", handleResize);

    // Animation loop con throttling
    let animId: number;
    let lastFrame = 0;

    function loop(timestamp: number): void {
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
      class="fixed inset-0 pointer-events-none"
      style="z-index:1; opacity:0.25"
      aria-hidden="true"
    />
  );
}
