import type React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Paperclip,
  Plus,
  Sparkles,
  Copy,
  RotateCcw,
  ArrowUp,
} from "lucide-react";
import GeometricIcon from "@/components/notes/geometricIcon";
import { themes } from "@/components/notes/themes";
import type { Message, Theme } from "@/components/notes/types";

interface ChatAreaProps {
  chatAreaRef: React.RefObject<HTMLDivElement | null>;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  messageInputRef: React.RefObject<HTMLTextAreaElement | null>;
  messages: Message[];
  message: string;
  setMessage: (message: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  sendMessage: () => void;
  currentTheme: Theme;
}

export default function ChatArea({
  chatAreaRef,
  chatContainerRef,
  messageInputRef,
  messages,
  message,
  setMessage,
  handleKeyPress,
  sendMessage,
  currentTheme,
}: ChatAreaProps) {
  const theme = themes[currentTheme];

  const isDarkTheme =
    currentTheme === "midnight" ||
    currentTheme === "galaxy" ||
    currentTheme === "neon" ||
    currentTheme === "holographic";
  const isCoralTheme = currentTheme === "coral";

  return (
    <div ref={chatAreaRef} className="flex-1 flex flex-col relative z-10">
      {/* Messages */}
      <ScrollArea className="flex-1" ref={chatContainerRef}>
        <div className="max-w-3xl mx-auto px-6 pt-4 pb-8 space-y-8">
          {messages.map((msg, index) => (
            <div key={msg.id} className="message-item">
              {msg.sender === "user" ? (
                // User Message
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 ${
                      isDarkTheme
                        ? currentTheme === "holographic"
                          ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25"
                          : "bg-white text-black"
                        : isCoralTheme
                          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                          : currentTheme === "arctic"
                            ? "bg-gradient-to-r from-slate-400 to-blue-300 text-white shadow-lg"
                            : currentTheme === "volcano"
                              ? "bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg"
                              : currentTheme === "vintage"
                                ? "bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg"
                                : "bg-black text-white"
                    } rounded-full flex items-center justify-center text-sm font-medium`}
                  >
                    U
                  </div>
                  <div className="flex-1">
                    <div
                      className={`inline-block ${
                        isDarkTheme
                          ? currentTheme === "holographic"
                            ? "bg-purple-500/20 border-purple-400/50 backdrop-blur-xl"
                            : "bg-slate-700 border-slate-600"
                          : isCoralTheme
                            ? "bg-gradient-to-r from-orange-100 to-pink-100 border-orange-200 shadow-md"
                            : currentTheme === "arctic"
                              ? "bg-gradient-to-r from-slate-100 to-blue-100 border-slate-300 shadow-md"
                              : currentTheme === "volcano"
                                ? "bg-gradient-to-r from-red-100 to-yellow-100 border-red-300 shadow-md"
                                : currentTheme === "vintage"
                                  ? "bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 shadow-lg"
                                  : "bg-stone-100 border-stone-200"
                      } border rounded-2xl px-4 py-2 max-w-fit`}
                    >
                      <p
                        className={`${theme.text} leading-relaxed ${
                          currentTheme === "vintage" ? "font-serif" : ""
                        }`}
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // AI Message
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <GeometricIcon currentTheme={currentTheme} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p
                      className={`${theme.text} leading-relaxed ${
                        currentTheme === "vintage" ? "font-serif" : ""
                      }`}
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {msg.content}
                    </p>
                    {/* Message Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-2 rounded-lg ${
                          isDarkTheme
                            ? currentTheme === "holographic"
                              ? "hover:bg-purple-500/20"
                              : "hover:bg-slate-700"
                            : isCoralTheme
                              ? "hover:bg-orange-100"
                              : currentTheme === "arctic"
                                ? "hover:bg-slate-100"
                                : currentTheme === "volcano"
                                  ? "hover:bg-red-100"
                                  : currentTheme === "vintage"
                                    ? "hover:bg-amber-100"
                                    : "hover:bg-gray-100"
                        }`}
                      >
                        <Copy
                          className={`w-4 h-4 ${
                            isDarkTheme ? "text-gray-400" : theme.iconColor
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-3 py-2 rounded-lg ${
                          isDarkTheme
                            ? currentTheme === "holographic"
                              ? "hover:bg-purple-500/20 text-gray-300"
                              : "hover:bg-slate-700 text-gray-400"
                            : isCoralTheme
                              ? "hover:bg-orange-100 text-orange-600"
                              : currentTheme === "arctic"
                                ? "hover:bg-slate-100 text-slate-600"
                                : currentTheme === "volcano"
                                  ? "hover:bg-red-100 text-red-600"
                                  : currentTheme === "vintage"
                                    ? "hover:bg-amber-100 text-amber-700 font-serif"
                                    : "hover:bg-gray-100 text-gray-500"
                        } text-sm`}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Retry
                      </Button>
                    </div>
                    {/* Disclaimer */}
                    {index === messages.length - 1 && msg.sender === "ai" && (
                      <p
                        className={`text-xs mt-4 ${
                          isDarkTheme ? "text-gray-400" : "text-gray-500"
                        } ${currentTheme === "vintage" ? "font-serif" : ""}`}
                      >
                        Our model can make mistakes. Please double-check
                        responses.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Input */}
      <div
        className={`px-6 py-4 ${
          isCoralTheme
            ? "bg-white/50 backdrop-blur-sm"
            : currentTheme === "arctic"
              ? "bg-white/60 backdrop-blur-sm"
              : currentTheme === "volcano"
                ? "bg-white/55 backdrop-blur-sm"
                : currentTheme === "holographic"
                  ? "bg-black/30 backdrop-blur-xl"
                  : currentTheme === "vintage"
                    ? "bg-amber-50/60 backdrop-blur-sm"
                    : theme.background
        } border-t ${theme.border}`}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className={`relative ${
              isDarkTheme
                ? currentTheme === "holographic"
                  ? "bg-black/50 backdrop-blur-xl border-purple-400/50"
                  : "bg-slate-800"
                : isCoralTheme
                  ? "bg-white/80 backdrop-blur-sm"
                  : currentTheme === "arctic"
                    ? "bg-white/90 backdrop-blur-sm"
                    : currentTheme === "volcano"
                      ? "bg-white/85 backdrop-blur-sm"
                      : currentTheme === "vintage"
                        ? "bg-amber-50/90 backdrop-blur-sm border-amber-300 shadow-xl"
                        : "bg-white"
            } rounded-2xl border-2 ${theme.border} shadow-lg ${
              theme.hover
            } transition-colors ${
              currentTheme === "holographic"
                ? "shadow-purple-500/25 shadow-2xl"
                : ""
            } ${currentTheme === "vintage" ? "shadow-amber-200/50" : ""}`}
          >
            <textarea
              ref={messageInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask ..."
              className={`w-full px-6 py-4 ${theme.text} ${
                isDarkTheme ? "placeholder-gray-400" : "placeholder-gray-500"
              } bg-transparent border-none outline-none resize-none rounded-2xl min-h-[60px] max-h-[200px] ${
                currentTheme === "vintage" ? "font-serif" : ""
              }`}
              rows={1}
              style={{ lineHeight: "1.5" }}
            />
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 rounded-lg ${
                    isDarkTheme
                      ? currentTheme === "holographic"
                        ? "hover:bg-purple-500/20"
                        : "hover:bg-slate-700"
                      : isCoralTheme
                        ? "hover:bg-orange-100"
                        : currentTheme === "arctic"
                          ? "hover:bg-slate-100"
                          : currentTheme === "volcano"
                            ? "hover:bg-red-100"
                            : currentTheme === "vintage"
                              ? "hover:bg-amber-100"
                              : "hover:bg-gray-100"
                  }`}
                >
                  <Plus
                    className={`w-4 h-4 ${
                      isDarkTheme ? "text-gray-400" : theme.iconColor
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 rounded-lg ${
                    isDarkTheme
                      ? currentTheme === "holographic"
                        ? "hover:bg-purple-500/20"
                        : "hover:bg-slate-700"
                      : isCoralTheme
                        ? "hover:bg-orange-100"
                        : currentTheme === "arctic"
                          ? "hover:bg-slate-100"
                          : currentTheme === "volcano"
                            ? "hover:bg-red-100"
                            : currentTheme === "vintage"
                              ? "hover:bg-amber-100"
                              : "hover:bg-gray-100"
                  }`}
                >
                  <Sparkles
                    className={`w-4 h-4 ${
                      isDarkTheme ? "text-gray-400" : theme.iconColor
                    }`}
                  />
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm ${
                    isDarkTheme
                      ? "text-gray-400"
                      : isCoralTheme
                        ? "text-gray-600"
                        : currentTheme === "arctic"
                          ? "text-slate-600"
                          : currentTheme === "volcano"
                            ? "text-red-700"
                            : currentTheme === "vintage"
                              ? "text-amber-700 font-serif"
                              : "text-gray-500"
                  }`}
                >
                  using pesca
                </span>
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`w-8 h-8 bg-gradient-to-r ${
                    currentTheme === "holographic"
                      ? "from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-lg shadow-purple-500/25"
                      : theme.primary + " hover:" + theme.primaryHover
                  } text-white rounded-lg p-0 disabled:bg-gray-200 disabled:text-gray-400 ${
                    isCoralTheme || currentTheme === "vintage"
                      ? "shadow-lg"
                      : ""
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
