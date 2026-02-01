/**
 * AI Chatbot Panel.
 *
 * Conversational assistant that explains:
 *  - What this portfolio is and how it works
 *  - All available commands (including easter eggs)
 *  - Info about Adrian: projects, experience, skills, contact
 *
 * Design:
 *  - Terminal style for consistency with the rest of the portfolio
 *  - Pattern matching by keywords for predefined responses
 *  - Quick replies to guide the user
 *  - Avatars and timestamps for better UX
 */

import { useState, useRef, useEffect } from "preact/hooks";
import { getResponse, QUICK_REPLIES } from "./chatResponses";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ── Avatar Components ───────────────────────────────────────

function AssistantAvatar() {
  return (
    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30">
      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    </div>
  );
}

function UserAvatar() {
  return (
    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
      <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}

// ── Typing Indicator ────────────────────────────────────────

function TypingIndicator() {
  return (
    <div class="flex items-start gap-2">
      <AssistantAvatar />
      <div class="bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-700/50">
        <div class="flex items-center gap-1.5">
          <span
            class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </div>
      </div>
    </div>
  );
}

// ── Time Formatter ──────────────────────────────────────────

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// ── Main Component ──────────────────────────────────────────

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `👋 Hey! I'm Adrian's AI assistant.

This website is an interactive terminal-style portfolio — you can type real commands with your keyboard.

Ask me about:
• Available commands
• Adrian's projects
• His experience and skills
• Hidden easter eggs 👀
• How to contact him

What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
  };

  const sendMessage = (text: string) => {
    setInput("");
    setShowQuickReplies(false);
    setMessages((prev) => [...prev, { role: "user", content: text, timestamp: new Date() }]);
    setIsLoading(true);

    // Simulate thinking delay for natural feel
    const delay = 300 + Math.random() * 400;
    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, timestamp: new Date() },
      ]);
      setIsLoading(false);
    }, delay);
  };

  const handleQuickReply = (query: string) => {
    sendMessage(query);
  };

  return (
    <div
      class="
        fixed bottom-36 sm:bottom-24 right-4 sm:right-6 z-50
        w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px]
        h-[min(580px,calc(100vh-8rem))]
        bg-gray-900/95 backdrop-blur-xl rounded-2xl
        shadow-2xl shadow-black/50
        border border-gray-700/50
        flex flex-col
        font-mono
        animate-slide-up
        overflow-hidden
      "
    >
      {/* Header */}
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700/50 bg-gray-800/50">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
          </div>
          <div>
            <div class="text-white text-sm font-semibold">AIR Assistant</div>
            <div class="text-gray-400 text-xs">Online • Ask me anything</div>
          </div>
        </div>
        <button
          onClick={onClose}
          class="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all p-2 rounded-lg focus-ring"
          aria-label="Close chat"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} class="flex-1 overflow-y-auto p-4 space-y-4 terminal-scroll">
        {messages.map((msg, i) => (
          <div
            key={i}
            class={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" ? <AssistantAvatar /> : <UserAvatar />}
            <div class="flex flex-col gap-1 max-w-[80%]">
              <div
                class={`
                  px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                      : "bg-gray-800/80 backdrop-blur-sm text-gray-200 rounded-2xl rounded-tl-sm border border-gray-700/50"
                  }
                `}
              >
                {msg.content}
              </div>
              <span
                class={`text-[10px] text-gray-500 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {isLoading && <TypingIndicator />}

        {/* Quick Replies */}
        {showQuickReplies && !isLoading && messages.length === 1 && (
          <div class="pt-2">
            <div class="text-xs text-gray-500 mb-2">Quick questions:</div>
            <div class="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.query}
                  onClick={() => {
                    handleQuickReply(qr.query);
                  }}
                  class="
                    px-3 py-1.5 text-xs
                    bg-gray-800/60 hover:bg-blue-600/20
                    border border-gray-700/50 hover:border-blue-500/50
                    text-gray-300 hover:text-blue-400
                    rounded-full
                    transition-all duration-200
                    focus-ring
                  "
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} class="p-3 border-t border-gray-700/50 bg-gray-800/30">
        <div class="flex gap-2">
          <label class="sr-only" htmlFor="chat-input">
            Ask about Adrian
          </label>
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onInput={(e) => {
              setInput((e.target as HTMLInputElement).value);
            }}
            placeholder="Ask about Adrian..."
            class="
              flex-1 bg-gray-900/80 border border-gray-700/50 rounded-xl
              px-4 py-2.5 text-sm text-white
              focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
              placeholder-gray-500
              transition-all
            "
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            class="
              bg-gradient-to-r from-blue-600 to-blue-500
              hover:from-blue-500 hover:to-blue-400
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-500
              px-4 py-2.5 rounded-xl
              text-white text-sm font-semibold
              transition-all duration-200 btn-press focus-ring
              shadow-lg shadow-blue-600/20
              flex items-center justify-center
            "
            aria-label="Send message"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
