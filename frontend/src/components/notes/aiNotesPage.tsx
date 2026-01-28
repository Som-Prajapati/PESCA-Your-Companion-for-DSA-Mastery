"use client";
import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import WelcomeScreen from "@/components/notes/welcomeScreen";
import ChatArea from "@/components/notes/chatArea";
import ThemeSelector from "@/components/notes/themeSelector";
import type { Message, Theme } from "./types";

export default function AINotesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const initialInputRef = useRef<HTMLTextAreaElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation for welcome screen
    if (!hasStartedChat && welcomeRef.current) {
      gsap.fromTo(
        welcomeRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );
    }
  }, [hasStartedChat]);

  // Holographic animation effect
  useEffect(() => {
    if (currentTheme === "holographic") {
      const interval = setInterval(() => {
        const holoElements = document.querySelectorAll(".holo-animate");
        holoElements.forEach((el) => {
          const element = el as HTMLElement;
          element.style.backgroundPosition = `${Math.random() * 100}% ${
            Math.random() * 100
          }%`;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentTheme]);

  const scrollToLatestMessage = useCallback(() => {
    if (chatContainerRef.current) {
      const scrollContainer = chatContainerRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        const messageElements =
          scrollContainer.querySelectorAll(".message-item");
        const lastMessage = messageElements[messageElements.length - 1];
        if (lastMessage) {
          const containerTop = scrollContainer.scrollTop;
          const messageTop = (lastMessage as HTMLElement).offsetTop;
          scrollContainer.scrollTop = messageTop - 20;
        }
      }
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    // optimistic UI: show user msg immediately
    if (!hasStartedChat) {
      setHasStartedChat(true);
      if (welcomeRef.current) {
        gsap.to(welcomeRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.6,
          ease: "power3.in",
        });
      }
      setMessages([userMessage]);
    } else {
      setMessages((prev) => [...prev, userMessage]);
    }

    setIsTyping(true);
    const prompt = message;
    setMessage("");

    try {
      // call your server route -> Gemini
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      let replyText = "I couldn't fetch a response.";
      if (res.ok) {
        const data = await res.json();
        replyText = data?.text || replyText;
      } else {
        const err = await res.json().catch(() => ({}) as any);
        replyText = err?.error || replyText;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: replyText,
        sender: "ai",
        timestamp: new Date(),
      };

      // animate chat area only on first AI drop-in
      if (!hasStartedChat && chatAreaRef.current) {
        gsap.fromTo(
          chatAreaRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        );
      }

      setMessages((prev) => [...prev, aiResponse]);
    } catch (e: any) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Something went wrong talking to the model. Try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
      setTimeout(scrollToLatestMessage, 400);
    }
  }, [message, hasStartedChat, scrollToLatestMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        currentTheme === "holographic"
          ? "bg-gradient-to-br from-purple-900 via-blue-900 to-black"
          : currentTheme === "midnight" || currentTheme === "galaxy"
            ? currentTheme === "midnight"
              ? "bg-slate-900"
              : "bg-gray-900"
            : currentTheme === "neon"
              ? "bg-black"
              : currentTheme === "coral"
                ? "bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50"
                : currentTheme === "arctic"
                  ? "bg-gradient-to-br from-slate-50 via-blue-50 to-white"
                  : currentTheme === "volcano"
                    ? "bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"
                    : currentTheme === "vintage"
                      ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
                      : "bg-white"
      } transition-colors duration-300 ${
        currentTheme === "holographic" ? "relative overflow-hidden" : ""
      }`}
    >
      {/* Holographic animated background */}
      {currentTheme === "holographic" && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 to-cyan-500 holo-animate"
            style={{
              backgroundSize: "400% 400%",
              animation: "gradient 8s ease infinite",
            }}
          />
        </div>
      )}

      {/* Vintage paper texture */}
      {currentTheme === "vintage" && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139,69,19,0.1) 0%, transparent 50%), 
                                radial-gradient(circle at 80% 20%, rgba(139,69,19,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 40% 80%, rgba(139,69,19,0.1) 0%, transparent 50%)`,
          }}
        />
      )}

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <ThemeSelector
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        showThemeSelector={showThemeSelector}
        setShowThemeSelector={setShowThemeSelector}
      />

      {!hasStartedChat ? (
        <WelcomeScreen
          welcomeRef={welcomeRef}
          initialInputRef={initialInputRef}
          message={message}
          setMessage={setMessage}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
          currentTheme={currentTheme}
        />
      ) : (
        <ChatArea
          chatAreaRef={chatAreaRef}
          chatContainerRef={chatContainerRef}
          messageInputRef={messageInputRef}
          messages={messages}
          message={message}
          setMessage={setMessage}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
          currentTheme={currentTheme}
        />
      )}
    </div>
  );
}
