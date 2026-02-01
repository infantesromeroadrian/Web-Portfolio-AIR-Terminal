/**
 * Floating AI chatbot bubble.
 *
 * This component displays a floating button in the bottom right corner
 * that opens/closes the chat panel when clicked.
 *
 * Design decisions:
 *  - Fixed position to always be visible
 *  - Pulse animation to attract attention
 *  - Proactive message after inactivity
 *  - High z-index to be above everything
 */

import { useState, useEffect } from "preact/hooks";
import ChatPanel from "./ChatPanel";

const PROACTIVE_DELAY_MS = 12000; // 12 seconds of inactivity
const PROACTIVE_STORAGE_KEY = "chat-proactive-shown";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProactiveHint, setShowProactiveHint] = useState(false);

  /**
   * Proactive message — appears after X seconds if user
   * hasn't interacted with chat (only once per session).
   */
  useEffect(() => {
    // Don't show if already shown this session
    if (sessionStorage.getItem(PROACTIVE_STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowProactiveHint(true);
        sessionStorage.setItem(PROACTIVE_STORAGE_KEY, "true");
      }
    }, PROACTIVE_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Hide proactive hint when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowProactiveHint(false);
    }
  }, [isOpen]);

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

      {/* Floating bubble + tooltip — higher on mobile to not cover bottom bar */}
      <div class="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 group">
        {/* Main button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          class={`
            relative
            w-14 h-14 sm:w-16 sm:h-16 rounded-full
            bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500
            shadow-lg shadow-blue-600/40
            flex items-center justify-center
            transition-all duration-300 ease-out
            hover:scale-110 hover:shadow-blue-500/50 hover:shadow-xl
            focus-ring
            ${isOpen ? "rotate-0" : ""}
          `}
          aria-label={isOpen ? "Close chat" : "Open AI chat"}
        >
          {/* Pulse ring when closed */}
          {!isOpen && (
            <span class="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30"></span>
          )}

          {isOpen ? (
            /* X icon to close */
            <svg
              class="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform duration-200"
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
            /* Chat/AI icon */
            <svg
              class="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform duration-200"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          )}
        </button>

        {/* Proactive message — appears after inactivity */}
        {showProactiveHint && !isOpen && (
          <div
            class="
              absolute bottom-[72px] sm:bottom-20 right-0
              bg-gradient-to-r from-blue-600 to-blue-500
              text-white text-xs sm:text-sm font-mono
              px-4 py-3 rounded-2xl rounded-br-sm
              shadow-xl shadow-blue-600/30
              animate-slide-up
              cursor-pointer
              max-w-[200px]
              border border-blue-400/20
            "
            onClick={() => {
              setIsOpen(true);
              setShowProactiveHint(false);
            }}
          >
            <div class="flex items-center gap-2 font-semibold">
              <span>👋</span>
              <span>Need help?</span>
            </div>
            <div class="text-[11px] text-blue-200 mt-1">Ask me about Adrian's work</div>
            {/* Close hint button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProactiveHint(false);
              }}
              class="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shadow-lg"
              aria-label="Dismiss"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Hover tooltip — visible on hover, hidden on mobile */}
        {!isOpen && !showProactiveHint && (
          <div
            class="
              absolute bottom-3 right-[72px] sm:right-20
              bg-gray-900/95 backdrop-blur-sm text-white text-xs sm:text-sm font-mono
              px-3 py-2 rounded-xl whitespace-nowrap
              border border-gray-700/50
              opacity-0 group-hover:opacity-100
              transition-all duration-300
              pointer-events-none
              hidden sm:block
              shadow-xl
            "
          >
            <div class="flex items-center gap-2">
              <span>💬</span>
              <span>Ask about Adrian</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
