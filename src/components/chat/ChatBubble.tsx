/**
 * Floating AI chatbot bubble.
 *
 * This component displays a floating button in the bottom right corner
 * that opens/closes the chat panel when clicked.
 *
 * Design decisions:
 *  - Fixed position but visually discreet
 *  - No proactive interruptions
 *  - Minimal chrome so it doesn't compete with the portfolio content
 *  - High z-index to stay accessible when needed
 */

import { lazy, Suspense } from "preact/compat";
import { useState } from "preact/hooks";
import ChatPanel from "./ChatPanel";

const ChatOrb = lazy(() => import("./ChatOrb"));

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });

  const handleMouseMove = (e: MouseEvent) => {
    const bounds = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const offsetX = (e.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (e.clientY - bounds.top) / bounds.height - 0.5;

    setTilt({
      rotateX: Number((-offsetY * 10).toFixed(2)),
      rotateY: Number((offsetX * 10).toFixed(2)),
      glowX: Math.round((offsetX + 0.5) * 100),
      glowY: Math.round((offsetY + 0.5) * 100),
    });
  };

  const resetTilt = () => {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  };

  return (
    <>
      {/* Chat panel (visible when isOpen = true) */}
      {isOpen && (
        <ChatPanel
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}

      {/* Floating bubble — visible pero discreto */}
      <div class="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50">
        {/* Main button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          class={`
            relative
            w-12 h-12 sm:w-14 sm:h-14 rounded-full
            bg-transparent
            shadow-lg shadow-black/30
            flex items-center justify-center
            transition-all duration-300 ease-out
            hover:border-blue-500/50 hover:shadow-blue-500/15
            focus-ring
            ${isOpen ? "rotate-0" : ""}
          `}
          style={{
            perspective: "800px",
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: "preserve-3d",
          }}
          aria-label={isOpen ? "Close chat" : "Open AI chat"}
        >
          <span
            class="absolute inset-0 rounded-full border border-gray-700/70 bg-gray-900/88 backdrop-blur-md"
            style={{
              transform: "translateZ(-8px) scale(0.96)",
              boxShadow: "0 14px 24px rgba(15, 23, 42, 0.35)",
            }}
          />

          <span
            class="absolute inset-0 rounded-full"
            style={{
              transform: "translateZ(10px)",
              background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(34, 211, 238, 0.22), transparent 58%)`,
              opacity: 0.9,
            }}
          />

          {isOpen ? (
            /* X icon to close */
            <svg
              class="relative w-5 h-5 sm:w-6 sm:h-6 text-gray-200 transition-transform duration-200"
              style={{ transform: "translateZ(18px)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <span
              class="relative flex items-center justify-center"
              style={{ transform: "translateZ(18px)" }}
            >
              <Suspense
                fallback={
                  <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-400/25 border border-cyan-300/40" />
                }
              >
                <ChatOrb />
              </Suspense>
            </span>
          )}
        </button>
      </div>
    </>
  );
}
