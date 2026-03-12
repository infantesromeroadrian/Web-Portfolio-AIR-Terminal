/**
 * Componente raíz de la aplicación.
 *
 * Este componente actúa como "root controller" del proyecto:
 *  - Gestiona el estado global mínimo (login → terminal)
 *  - Orquesta los componentes principales (Header, Terminal, LoginPanel)
 *  - Mantiene la UI desacoplada de la lógica interna (useTerminal)
 *  - Soporta modo L4tentNoise (identidad secreta via Konami code)
 *
 * La lógica de negocio NO vive aquí. Este archivo solo coordina.
 */

import { useState, useEffect, useCallback, lazy, Suspense } from "preact/compat";

// Componentes principales de la interfaz
import PageHeader from "./components/layout/PageHeader";
import Footer from "./components/layout/Footer";
import Terminal from "./components/terminal/Terminal";
import LoginPanel from "./components/login/LoginPanel";
import BootSequence from "./components/intro/BootSequence";
import MatrixBackground from "./components/background/MatrixBackground";
import ChatBubble from "./components/chat/ChatBubble";

// Lazy-loaded: globe.gl + three.js (~600KB) — se carga en background
const TacticalGlobe = lazy(() => import("./components/background/TacticalGlobe"));

import CRTEffect from "./components/effects/CRTEffect";

// Hook que encapsula toda la lógica de la terminal
import { useTerminal } from "./core/hooks/useTerminal";

// L4tentNoise mode (identidad secreta)
import { L4tentNoiseProvider, useL4tentNoise } from "./core/context/L4tentNoiseContext";
import { useKonamiCode } from "./core/hooks/useKonamiCode";

// Returning visitor detection (shared with commandRouter for `replay` command)
import { isReturningVisitor, markAsReturningVisitor } from "./core/utils/visitTracker";

import "./styles/globals.css";

/**
 * Componente interno que tiene acceso al contexto L4tentNoise
 */
function AppContent() {
  /**
   * Controla la etapa actual:
   *  - "boot": secuencia BIOS inicial
   *  - "login": se muestra el personaje caminando + intro
   *  - "terminal": se muestra la terminal interactiva
   *
   * Returning visitors skip boot+login and go straight to terminal.
   */
  const [stage, setStage] = useState<"boot" | "login" | "terminal">(() =>
    isReturningVisitor() ? "terminal" : "boot"
  );

  // L4tentNoise mode context
  const { isL4tentMode, toggleL4tent } = useL4tentNoise();

  // Estado para mostrar mensaje de activación
  const [showActivationMessage, setShowActivationMessage] = useState(false);

  /**
   * Hook que contiene:
   *  - historial de salida
   *  - animación de comandos
   *  - router de comandos
   *  - helpers de impresión
   */
  const terminal = useTerminal({ isL4tentMode, toggleL4tent });

  // Auto-run whoami for returning visitors who skip boot+login
  useEffect(() => {
    if (isReturningVisitor() && stage === "terminal") {
      const timer = setTimeout(() => {
        void terminal.runCommand("whoami");
      }, 150);
      return () => {
        clearTimeout(timer);
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

  // Callback para cuando se activa el Konami code (alternativa al comando)
  const handleKonamiActivation = useCallback(() => {
    toggleL4tent();
    setShowActivationMessage(true);
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setShowActivationMessage(false);
    }, 3000);
  }, [toggleL4tent]);

  // Escuchar Konami code (alternativa secreta)
  useKonamiCode(handleKonamiActivation);

  // Permitir saltar la secuencia de boot con cualquier tecla
  useEffect(() => {
    if (stage !== "boot") return;

    const handleKeyPress = () => {
      setStage("login");
    };
    const handleClick = () => {
      setStage("login");
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleClick);
    };
  }, [stage]);

  return (
    <div class="relative min-h-screen flex flex-col">
      {/* Secuencia de arranque BIOS */}
      {stage === "boot" && (
        <BootSequence
          onComplete={() => {
            setStage("login");
          }}
        />
      )}

      {/* Capa 1: Globo táctico 3D de fondo */}
      {(stage === "login" || stage === "terminal") && (
        <Suspense fallback={null}>
          <TacticalGlobe />
        </Suspense>
      )}

      {/* Capas secundarias — solo en terminal para despejar el hero */}
      {stage === "terminal" && <MatrixBackground />}
      {stage === "terminal" && <CRTEffect />}

      {/* Chatbot flotante — solo cuando el usuario ya está en la terminal */}
      {stage === "terminal" && <ChatBubble />}

      {/* Badge de modo L4tentNoise */}
      {isL4tentMode && stage === "terminal" && (
        <div class="l4tent-badge">
          <span class="mr-2">&#9760;</span>
          L4TENTNOISE MODE
        </div>
      )}

      {/* Header visible solo en modo terminal */}
      {stage === "terminal" && (
        <PageHeader runCommand={terminal.runCommand} isL4tentMode={isL4tentMode} />
      )}

      {/* Contenedor principal de contenido */}
      <div class="relative z-10 flex flex-col flex-grow pt-20">
        {/* LOGIN / INTRO */}
        {stage === "login" && (
          <div class="flex-grow flex items-center justify-center">
            <LoginPanel
              onLogin={() => {
                markAsReturningVisitor();
                setStage("terminal");
                // Ejecutar whoami automáticamente después de un breve delay
                setTimeout(() => {
                  void terminal.runCommand("whoami");
                }, 300);
              }}
            />
          </div>
        )}

        {/* TERMINAL */}
        {stage === "terminal" && (
          <div class="flex-grow flex items-start justify-center">
            <Terminal terminal={terminal} />
          </div>
        )}

        {/* Footer fijo al final en modo terminal */}
        {stage === "terminal" && <Footer />}
      </div>

      {/* Mensaje de activación/desactivación */}
      {showActivationMessage && (
        <div class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div
            class="text-center p-8 rounded-lg animate-fade-in"
            style={{
              background: isL4tentMode ? "rgba(255,0,51,0.1)" : "rgba(51,153,255,0.1)",
              border: `2px solid ${isL4tentMode ? "#ff0033" : "#3399ff"}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              class="text-4xl font-bold mb-2"
              style={{ color: isL4tentMode ? "#ff0033" : "#3399ff" }}
            >
              {isL4tentMode ? "L4TENTNOISE ACTIVATED" : "CIVILIAN MODE"}
            </div>
            <div class="text-sm text-gray-400">
              {isL4tentMode
                ? "Secret identity unlocked. Type 'whoami' to see your true self."
                : "Returning to normal operations."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Componente raíz que envuelve todo con el provider de L4tentNoise
 */
export function App() {
  return (
    <L4tentNoiseProvider>
      <AppContent />
    </L4tentNoiseProvider>
  );
}
