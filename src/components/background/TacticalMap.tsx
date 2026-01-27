/**
 * Mapa táctico de fondo estilo SOC/SIEM.
 *
 * Renderiza sobre <canvas>:
 *  - Mapa mundo wireframe (puntos de coordenadas)
 *  - Nodos de ciudades clave pulsando
 *  - Arcos de "tráfico de amenazas" animados entre nodos
 *  - Grid hexagonal sutil de fondo
 *  - Radar sweep en Madrid (base de operaciones)
 *
 * Cero dependencias externas. requestAnimationFrame con rate-limiting.
 */

import { useEffect, useRef } from "preact/hooks";

// ── Constantes ──────────────────────────────────────────────

const FPS_INTERVAL = 33; // ~30 FPS

/** Proyección Mercator simplificada: lon/lat → x/y en canvas */
function project(lon: number, lat: number, w: number, h: number): [number, number] {
  const x = ((lon + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return [x, y];
}

// ── Nodos tácticos (ciudades clave en ciberseguridad) ───────

interface TacticalNode {
  name: string;
  lon: number;
  lat: number;
  type: "base" | "ally" | "threat";
}

const NODES: TacticalNode[] = [
  // Base de operaciones
  { name: "Madrid", lon: -3.7, lat: 40.4, type: "base" },
  // Aliados
  { name: "London", lon: -0.1, lat: 51.5, type: "ally" },
  { name: "Washington", lon: -77.0, lat: 38.9, type: "ally" },
  { name: "Frankfurt", lon: 8.7, lat: 50.1, type: "ally" },
  { name: "Tokyo", lon: 139.7, lat: 35.7, type: "ally" },
  { name: "Singapore", lon: 103.8, lat: 1.3, type: "ally" },
  // Amenazas
  { name: "Moscow", lon: 37.6, lat: 55.8, type: "threat" },
  { name: "Beijing", lon: 116.4, lat: 39.9, type: "threat" },
  { name: "Pyongyang", lon: 125.7, lat: 39.0, type: "threat" },
  { name: "Tehran", lon: 51.4, lat: 35.7, type: "threat" },
];

// ── Arcos de tráfico (origen → destino) ─────────────────────

interface ThreatArc {
  from: number; // index into NODES
  to: number;
  speed: number; // 0-1 progress per second
  color: string;
}

const ARCS: ThreatArc[] = [
  { from: 6, to: 0, speed: 0.3, color: "#ff3333" }, // Moscow → Madrid
  { from: 7, to: 0, speed: 0.25, color: "#ff3333" }, // Beijing → Madrid
  { from: 8, to: 2, speed: 0.35, color: "#ff6600" }, // Pyongyang → Washington
  { from: 9, to: 3, speed: 0.28, color: "#ff6600" }, // Tehran → Frankfurt
  { from: 7, to: 4, speed: 0.32, color: "#ff3333" }, // Beijing → Tokyo
  { from: 0, to: 1, speed: 0.4, color: "#2563eb" }, // Madrid → London (defense)
  { from: 0, to: 2, speed: 0.35, color: "#2563eb" }, // Madrid → Washington (defense)
  { from: 0, to: 5, speed: 0.3, color: "#22d3ee" }, // Madrid → Singapore (intel)
];

// ── Mapa mundo simplificado (coordenadas de costas) ─────────
// Cada sub-array es un trazo continuo de puntos [lon, lat]

const WORLD_OUTLINE: [number, number][][] = [
  // Europa
  [
    [-10, 35],
    [-5, 36],
    [0, 38],
    [3, 43],
    [5, 44],
    [9, 44],
    [13, 45],
    [15, 42],
    [19, 42],
    [24, 38],
    [26, 41],
    [29, 41],
    [30, 45],
    [28, 50],
    [25, 55],
    [20, 55],
    [12, 55],
    [10, 54],
    [5, 51],
    [0, 50],
    [-5, 48],
    [-10, 44],
    [-10, 35],
  ],
  // Africa
  [
    [-17, 15],
    [-15, 11],
    [-8, 5],
    [5, 5],
    [10, 2],
    [12, 5],
    [10, 10],
    [15, 12],
    [20, 10],
    [32, 10],
    [40, 12],
    [45, 12],
    [50, 10],
    [42, 0],
    [40, -5],
    [35, -15],
    [30, -25],
    [28, -33],
    [18, -35],
    [12, -30],
    [8, -5],
    [5, 5],
  ],
  // Asia
  [
    [30, 45],
    [35, 42],
    [40, 40],
    [45, 38],
    [50, 37],
    [55, 40],
    [60, 42],
    [65, 40],
    [70, 35],
    [75, 30],
    [80, 28],
    [85, 28],
    [88, 22],
    [92, 20],
    [98, 16],
    [100, 14],
    [105, 10],
    [108, 16],
    [110, 20],
    [115, 22],
    [120, 25],
    [122, 30],
    [125, 35],
    [128, 35],
    [130, 38],
    [132, 34],
    [135, 35],
    [140, 40],
    [145, 45],
    [140, 50],
    [135, 55],
    [130, 50],
    [125, 45],
    [120, 50],
    [115, 55],
    [110, 55],
    [100, 55],
    [90, 55],
    [80, 55],
    [70, 60],
    [60, 60],
    [50, 55],
    [40, 50],
    [30, 45],
  ],
  // North America
  [
    [-170, 65],
    [-165, 60],
    [-160, 60],
    [-150, 60],
    [-140, 60],
    [-130, 55],
    [-125, 50],
    [-125, 45],
    [-120, 35],
    [-115, 30],
    [-110, 25],
    [-105, 20],
    [-100, 18],
    [-95, 18],
    [-90, 20],
    [-85, 22],
    [-82, 25],
    [-80, 25],
    [-78, 28],
    [-75, 35],
    [-70, 42],
    [-65, 45],
    [-60, 47],
    [-55, 50],
    [-60, 52],
    [-65, 55],
    [-70, 58],
    [-80, 60],
    [-90, 62],
    [-100, 65],
    [-110, 68],
    [-120, 70],
    [-140, 70],
    [-160, 70],
    [-170, 65],
  ],
  // South America
  [
    [-80, 10],
    [-75, 12],
    [-70, 12],
    [-65, 10],
    [-60, 5],
    [-52, 3],
    [-48, 0],
    [-45, -5],
    [-40, -10],
    [-38, -15],
    [-35, -22],
    [-40, -25],
    [-48, -28],
    [-50, -30],
    [-55, -35],
    [-60, -40],
    [-65, -45],
    [-68, -50],
    [-70, -55],
    [-72, -50],
    [-75, -45],
    [-75, -35],
    [-75, -25],
    [-78, -5],
    [-80, 0],
    [-80, 10],
  ],
  // Australia
  [
    [115, -35],
    [120, -35],
    [130, -32],
    [135, -35],
    [140, -38],
    [145, -38],
    [150, -35],
    [153, -28],
    [150, -22],
    [145, -15],
    [140, -12],
    [135, -12],
    [130, -15],
    [125, -15],
    [120, -20],
    [115, -22],
    [114, -25],
    [115, -30],
    [115, -35],
  ],
];

// ── Componente ──────────────────────────────────────────────

export default function TacticalMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvsEl = canvasRef.current;
    if (!cvsEl) return;
    const ctxEl = cvsEl.getContext("2d");
    if (!ctxEl) return;

    // Non-null aliases — early returns above guarantee these are valid
    const cvs = cvsEl;
    const ctx = ctxEl;

    let w = 0;
    let h = 0;
    let animId: number;
    let lastFrame = 0;

    // Arc animation progress (0→1, loops)
    const arcProgress = ARCS.map(() => Math.random());

    // Radar angle
    let radarAngle = 0;

    function resize() {
      w = cvs.width = window.innerWidth;
      h = cvs.height = window.innerHeight;
    }
    resize();

    let resizeTimeout: number | undefined;
    window.addEventListener("resize", () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 200);
    });

    function drawGrid() {
      ctx.strokeStyle = "rgba(37, 99, 235, 0.04)";
      ctx.lineWidth = 0.5;

      // Horizontal lines
      const spacing = 40;
      for (let y = 0; y < h; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      // Vertical lines
      for (let x = 0; x < w; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    }

    function drawWorldOutline() {
      ctx.strokeStyle = "rgba(37, 99, 235, 0.12)";
      ctx.lineWidth = 0.8;

      for (const outline of WORLD_OUTLINE) {
        ctx.beginPath();
        for (let i = 0; i < outline.length; i++) {
          const [x, y] = project(outline[i][0], outline[i][1], w, h);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    function drawNodes(time: number) {
      for (const node of NODES) {
        const [x, y] = project(node.lon, node.lat, w, h);
        const pulse = Math.sin(time / 500 + node.lon) * 0.5 + 0.5;

        if (node.type === "base") {
          // Madrid — bright pulsing circle
          const radius = 4 + pulse * 3;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${0.6 + pulse * 0.4})`;
          ctx.fill();

          // Outer ring
          ctx.beginPath();
          ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.2 + pulse * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Label
          ctx.fillStyle = "rgba(34, 211, 238, 0.8)";
          ctx.font = "9px monospace";
          ctx.fillText("HQ " + node.name.toUpperCase(), x + 12, y + 3);
        } else if (node.type === "ally") {
          const radius = 2 + pulse * 1.5;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(37, 99, 235, ${0.5 + pulse * 0.3})`;
          ctx.fill();
        } else {
          // Threat node — red
          const radius = 2.5 + pulse * 2;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 51, 51, ${0.4 + pulse * 0.4})`;
          ctx.fill();
        }
      }
    }

    function drawArcs(time: number, dt: number) {
      for (let i = 0; i < ARCS.length; i++) {
        const arc = ARCS[i];
        const fromNode = NODES[arc.from];
        const toNode = NODES[arc.to];
        const [x1, y1] = project(fromNode.lon, fromNode.lat, w, h);
        const [x2, y2] = project(toNode.lon, toNode.lat, w, h);

        // Update progress
        arcProgress[i] = (arcProgress[i] + (arc.speed * dt) / 1000) % 1;
        const p = arcProgress[i];

        // Draw arc path (quadratic curve with height)
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.15;

        // Faint trail
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.strokeStyle = arc.color
          .replace(")", ", 0.06)")
          .replace("rgb", "rgba")
          .replace("#ff3333", "rgba(255,51,51,0.06)")
          .replace("#ff6600", "rgba(255,102,0,0.06)")
          .replace("#2563eb", "rgba(37,99,235,0.06)")
          .replace("#22d3ee", "rgba(34,211,238,0.06)");
        // Simplified: just use low opacity
        ctx.strokeStyle = `${arc.color}15`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animated dot traveling along the arc
        const t = p;
        const dotX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
        const dotY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

        // Glow
        const gradient = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 8);
        gradient.addColorStop(0, arc.color + "aa");
        gradient.addColorStop(1, arc.color + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fillStyle = arc.color;
        ctx.fill();

        // Ignore time param to suppress lint
        void time;
      }
    }

    function drawRadar(time: number) {
      const [cx, cy] = project(-3.7, 40.4, w, h); // Madrid
      const radius = 60;

      radarAngle = (time / 2000) * Math.PI * 2;

      // Sweep
      // Conical gradient not widely supported — use line + arc sweep instead
      void 0;

      // Fallback: draw a sweeping line
      const endX = cx + Math.cos(radarAngle) * radius;
      const endY = cy + Math.sin(radarAngle) * radius;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Fading trail (arc)
      ctx.beginPath();
      ctx.arc(cx, cy, radius, radarAngle - 0.5, radarAngle);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.08)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Inner circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius / 2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.05)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    function drawHUD(time: number) {
      // Top-left status text
      ctx.fillStyle = "rgba(37, 99, 235, 0.15)";
      ctx.font = "10px monospace";
      ctx.fillText("TACTICAL OVERVIEW // BLUE CYBER AI", 20, 30);
      ctx.fillText(`NODES: ${NODES.length} | ARCS: ${ARCS.length} | STATUS: ACTIVE`, 20, 44);

      // Blinking indicator
      if (Math.floor(time / 800) % 2 === 0) {
        ctx.fillStyle = "rgba(34, 211, 238, 0.3)";
        ctx.fillRect(20, 52, 6, 6);
      }
      ctx.fillStyle = "rgba(37, 99, 235, 0.12)";
      ctx.fillText("SIGINT PROCESSING", 32, 58);
    }

    let prevTime = 0;

    function loop(timestamp: number) {
      animId = requestAnimationFrame(loop);
      if (timestamp - lastFrame < FPS_INTERVAL) return;

      const dt = timestamp - prevTime;
      prevTime = timestamp;
      lastFrame = timestamp;

      // Clear
      ctx.clearRect(0, 0, w, h);

      drawGrid();
      drawWorldOutline();
      drawArcs(timestamp, dt);
      drawNodes(timestamp);
      drawRadar(timestamp);
      drawHUD(timestamp);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      class="fixed inset-0 pointer-events-none"
      style="z-index:0"
      aria-hidden="true"
    />
  );
}
