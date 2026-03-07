/**
 * Globo táctico 3D — Visualización de ciberataques en tiempo real.
 *
 * Reemplaza al TacticalMap 2D con un globo WebGL 3D completo:
 *  - Globo terrestre oscuro con textura nocturna
 *  - Nodos pulsantes: base (Madrid/cyan), aliados (azul), amenazas (rojo)
 *  - Arcos animados de ataque y defensa entre ciudades
 *  - Anillos de propagación en el HQ (Madrid)
 *  - Auto-rotación suave centrada en Europa
 *  - Atmósfera con glow azul
 *
 * Dependencia: globe.gl (three.js bajo el capó).
 * Posición: fixed, z-index:0, pointer-events:none — fondo decorativo.
 */

import { useEffect, useRef } from "preact/hooks";
import Globe, { type GlobeInstance } from "globe.gl";

// ── Tipos ───────────────────────────────────────────────────

interface TacticalNode {
  name: string;
  lat: number;
  lng: number;
  type: "base" | "ally" | "threat";
  size: number;
}

interface ThreatArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  stroke: number;
  dashLength: number;
  dashGap: number;
  animateTime: number;
  label: string;
}

interface RingData {
  lat: number;
  lng: number;
}

// ── Datos tácticos ──────────────────────────────────────────

const NODES: TacticalNode[] = [
  // Base de operaciones
  { name: "HQ MADRID", lat: 40.4, lng: -3.7, type: "base", size: 0.6 },
  // Aliados
  { name: "London", lat: 51.5, lng: -0.1, type: "ally", size: 0.3 },
  { name: "Washington", lat: 38.9, lng: -77.0, type: "ally", size: 0.3 },
  { name: "Frankfurt", lat: 50.1, lng: 8.7, type: "ally", size: 0.3 },
  { name: "Tokyo", lat: 35.7, lng: 139.7, type: "ally", size: 0.25 },
  { name: "Singapore", lat: 1.3, lng: 103.8, type: "ally", size: 0.25 },
  // Amenazas
  { name: "Moscow", lat: 55.8, lng: 37.6, type: "threat", size: 0.4 },
  { name: "Beijing", lat: 39.9, lng: 116.4, type: "threat", size: 0.4 },
  { name: "Pyongyang", lat: 39.0, lng: 125.7, type: "threat", size: 0.35 },
  { name: "Tehran", lat: 35.7, lng: 51.4, type: "threat", size: 0.35 },
];

const ARCS: ThreatArc[] = [
  // Ataques (rojo/naranja → hacia aliados/base)
  {
    startLat: 55.8,
    startLng: 37.6,
    endLat: 40.4,
    endLng: -3.7,
    color: ["rgba(255,50,50,0.8)", "rgba(255,50,50,0.3)"],
    stroke: 0.4,
    dashLength: 0.3,
    dashGap: 0.15,
    animateTime: 3000,
    label: "RU → ES // APT28 C2 traffic",
  },
  {
    startLat: 39.9,
    startLng: 116.4,
    endLat: 40.4,
    endLng: -3.7,
    color: ["rgba(255,50,50,0.8)", "rgba(255,50,50,0.3)"],
    stroke: 0.35,
    dashLength: 0.25,
    dashGap: 0.2,
    animateTime: 4000,
    label: "CN → ES // APT41 exfiltration",
  },
  {
    startLat: 39.0,
    startLng: 125.7,
    endLat: 38.9,
    endLng: -77.0,
    color: ["rgba(255,100,0,0.7)", "rgba(255,100,0,0.3)"],
    stroke: 0.3,
    dashLength: 0.35,
    dashGap: 0.1,
    animateTime: 3500,
    label: "KP → US // Lazarus recon",
  },
  {
    startLat: 35.7,
    startLng: 51.4,
    endLat: 50.1,
    endLng: 8.7,
    color: ["rgba(255,100,0,0.7)", "rgba(255,100,0,0.3)"],
    stroke: 0.3,
    dashLength: 0.3,
    dashGap: 0.15,
    animateTime: 3200,
    label: "IR → DE // MuddyWater probe",
  },
  {
    startLat: 39.9,
    startLng: 116.4,
    endLat: 35.7,
    endLng: 139.7,
    color: ["rgba(255,50,50,0.7)", "rgba(255,50,50,0.3)"],
    stroke: 0.3,
    dashLength: 0.2,
    dashGap: 0.2,
    animateTime: 2800,
    label: "CN → JP // APT10 lateral",
  },
  // Defensivos (azul/cyan — desde Madrid)
  {
    startLat: 40.4,
    startLng: -3.7,
    endLat: 51.5,
    endLng: -0.1,
    color: ["rgba(37,99,235,0.7)", "rgba(37,99,235,0.3)"],
    stroke: 0.3,
    dashLength: 0.4,
    dashGap: 0.1,
    animateTime: 2000,
    label: "ES → UK // Threat intel share",
  },
  {
    startLat: 40.4,
    startLng: -3.7,
    endLat: 38.9,
    endLng: -77.0,
    color: ["rgba(37,99,235,0.7)", "rgba(37,99,235,0.3)"],
    stroke: 0.3,
    dashLength: 0.4,
    dashGap: 0.1,
    animateTime: 2500,
    label: "ES → US // IOC sync",
  },
  {
    startLat: 40.4,
    startLng: -3.7,
    endLat: 1.3,
    endLng: 103.8,
    color: ["rgba(34,211,238,0.6)", "rgba(34,211,238,0.2)"],
    stroke: 0.25,
    dashLength: 0.35,
    dashGap: 0.15,
    animateTime: 3500,
    label: "ES → SG // SIGINT relay",
  },
];

/** Anillo de propagación en Madrid HQ */
const RINGS: RingData[] = [{ lat: 40.4, lng: -3.7 }];

// ── Colores por tipo de nodo ────────────────────────────────

function getNodeColor(type: TacticalNode["type"]): string {
  switch (type) {
    case "base":
      return "#22d3ee"; // cyan
    case "ally":
      return "#2563eb"; // blue
    case "threat":
      return "#ff3333"; // red
  }
}

// ── Componente ──────────────────────────────────────────────

export default function TacticalGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<GlobeInstance | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Inicializar globe.gl ──
    const globe = new Globe(container)
      // Apariencia del globo
      .globeImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg")
      .bumpImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png")
      .backgroundColor("rgba(0,0,0,0)")
      .showAtmosphere(true)
      .atmosphereColor("#1e40af")
      .atmosphereAltitude(0.2)
      .showGraticules(false)

      // Vista inicial — centrada en Europa
      .pointOfView({ lat: 35, lng: 10, altitude: 2.2 })

      // ── Puntos (ciudades) ──
      .pointsData(NODES)
      .pointLat("lat")
      .pointLng("lng")
      .pointAltitude(0.01)
      .pointRadius("size")
      .pointColor((d: object) => getNodeColor((d as TacticalNode).type))
      .pointsMerge(false)

      // ── Labels ──
      .labelsData(NODES)
      .labelLat("lat")
      .labelLng("lng")
      .labelText("name")
      .labelSize(0.6)
      .labelDotRadius(0.3)
      .labelColor((d: object) => getNodeColor((d as TacticalNode).type))
      .labelAltitude(0.015)
      .labelResolution(2)
      .labelIncludeDot(false)

      // ── Arcos de ataque/defensa ──
      .arcsData(ARCS)
      .arcStartLat("startLat")
      .arcStartLng("startLng")
      .arcEndLat("endLat")
      .arcEndLng("endLng")
      .arcColor("color")
      .arcStroke("stroke")
      .arcDashLength("dashLength")
      .arcDashGap("dashGap")
      .arcDashAnimateTime("animateTime")
      .arcAltitudeAutoScale(0.4)
      .arcLabel("label")

      // ── Anillos de propagación (Madrid HQ) ──
      .ringsData(RINGS)
      .ringLat("lat")
      .ringLng("lng")
      .ringColor(() => "rgba(34,211,238,0.4)")
      .ringMaxRadius(4)
      .ringPropagationSpeed(2)
      .ringRepeatPeriod(1500)
      .ringAltitude(0.015);

    globeInstanceRef.current = globe;

    // ── Auto-rotación ──
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- globe.gl OrbitControls typing gap */
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

    // ── Resize handler ──
    function handleResize() {
      globe.width(window.innerWidth);
      globe.height(window.innerHeight);
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    // ── Regenerar arcos periódicamente para efecto "live" ──
    const arcInterval = setInterval(() => {
      // Shuffle un arco aleatorio para variar la animación
      const shuffled = [...ARCS].map((arc) => ({
        ...arc,
        animateTime: arc.animateTime + (Math.random() - 0.5) * 500,
      }));
      globe.arcsData(shuffled);
    }, 8000);

    return () => {
      clearInterval(arcInterval);
      window.removeEventListener("resize", handleResize);
      // Cleanup globe
      globe._destructor();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      class="fixed inset-0 pointer-events-none"
      style="z-index:0; opacity: 0.6"
      aria-hidden="true"
    />
  );
}
