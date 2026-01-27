/**
 * Hook para obtener el tamaño de la ventana de forma reactiva.
 *
 * Este hook resuelve el problema de que `window.innerWidth` solo se lee
 * una vez al montar el componente. Con este hook, los componentes
 * se re-renderizan cuando el usuario redimensiona la ventana.
 *
 * Características:
 *  - Debounce de 150ms para evitar re-renders excesivos
 *  - Limpieza automática del event listener al desmontar
 *  - Tipado estricto con TypeScript
 *
 * Uso típico:
 *  - Seleccionar banners ASCII según tamaño de pantalla
 *  - Adaptar layouts complejos que CSS no puede resolver solo
 */

import { useState, useEffect } from "preact/hooks";

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Breakpoints estándar para responsive design.
 * Coinciden con los valores usados en Tailwind CSS.
 */
const BREAKPOINTS = {
  mobile: 640, // < 640px
  tablet: 1024, // 640px - 1024px
  desktop: 1024, // >= 1024px
} as const;

/**
 * Hook que retorna el tamaño actual de la ventana.
 *
 * @param debounceMs - Tiempo de debounce en milisegundos (default: 150)
 * @returns Objeto con width y height actuales
 *
 * @example
 * ```tsx
 * const { width } = useWindowSize();
 * const isMobile = width < BREAKPOINTS.mobile;
 * ```
 */
export function useWindowSize(debounceMs = 150): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timeoutId: number | undefined;

    function handleResize() {
      // Cancelar timeout anterior si existe
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      // Debounce: esperar antes de actualizar el estado
      timeoutId = window.setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceMs);
    }

    // Escuchar eventos de resize
    window.addEventListener("resize", handleResize);

    // Limpieza al desmontar
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [debounceMs]);

  return size;
}

/**
 * Helper para determinar el tipo de dispositivo basado en el ancho.
 *
 * @param width - Ancho de la ventana en píxeles
 * @returns "mobile" | "tablet" | "desktop"
 */
export function getDeviceType(width: number): "mobile" | "tablet" | "desktop" {
  if (width < BREAKPOINTS.mobile) return "mobile";
  if (width < BREAKPOINTS.tablet) return "tablet";
  return "desktop";
}
