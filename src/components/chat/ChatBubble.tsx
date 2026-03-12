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

import { useState } from "preact/hooks";
import ChatPanel from "./ChatPanel";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

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
          class={`
            relative
            w-12 h-12 sm:w-14 sm:h-14 rounded-full
            bg-gray-900/88 backdrop-blur-md border border-gray-700/70
            shadow-lg shadow-black/30
            flex items-center justify-center
            transition-all duration-300 ease-out
            hover:border-blue-500/50 hover:shadow-blue-500/15
            focus-ring
            ${isOpen ? "rotate-0" : ""}
          `}
          aria-label={isOpen ? "Close chat" : "Open AI chat"}
        >
          {isOpen ? (
            /* X icon to close */
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-gray-200 transition-transform duration-200"
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
              class="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 transition-transform duration-200"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
