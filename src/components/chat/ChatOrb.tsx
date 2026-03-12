import { useEffect, useRef } from "preact/hooks";
import * as THREE from "three";

const MAX_PIXEL_RATIO = 1.5;
const CAMERA_DISTANCE = 4.2;
const FOV = 28;
const OUTER_ROTATION_SPEED = 0.0045;
const CORE_ROTATION_SPEED = 0.007;

export default function ChatOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = CAMERA_DISTANCE;

    const ambientLight = new THREE.AmbientLight(0x9ddcff, 1.5);
    const keyLight = new THREE.PointLight(0x22d3ee, 12, 0, 2);
    keyLight.position.set(3, 2.4, 5);

    const rimLight = new THREE.PointLight(0xff7b72, 5, 0, 2);
    rimLight.position.set(-2.8, -2, 4.5);

    scene.add(ambientLight, keyLight, rimLight);

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(1.02, 48, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x142033,
        emissive: 0x0f2b40,
        emissiveIntensity: 0.6,
        roughness: 0.18,
        metalness: 0.3,
        transmission: 0.18,
        transparent: true,
        opacity: 0.96,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      })
    );

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 22, 22),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.18,
        wireframe: true,
      })
    );

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.38, 1),
      new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        emissive: 0xff4d4d,
        emissiveIntensity: 0.32,
        roughness: 0.25,
        metalness: 0.18,
      })
    );

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(1.28, 1.42, 64),
      new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      })
    );
    halo.rotation.x = Math.PI / 2.6;

    scene.add(orb, shell, core, halo);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const size = canvas.clientWidth || 56;
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    resize();

    let frameId = 0;
    const render = () => {
      if (!reduceMotion) {
        orb.rotation.y += 0.0035;
        orb.rotation.x += 0.0014;
        shell.rotation.y -= OUTER_ROTATION_SPEED;
        shell.rotation.x += 0.0022;
        core.rotation.y += CORE_ROTATION_SPEED;
        core.rotation.x -= 0.0045;
        halo.rotation.z += 0.0025;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      orb.geometry.dispose();
      shell.geometry.dispose();
      core.geometry.dispose();
      halo.geometry.dispose();

      const materials = [orb.material, shell.material, core.material, halo.material];
      for (const material of materials) {
        material.dispose();
      }

      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      class="relative w-6 h-6 sm:w-7 sm:h-7 pointer-events-none"
      aria-hidden="true"
    />
  );
}
