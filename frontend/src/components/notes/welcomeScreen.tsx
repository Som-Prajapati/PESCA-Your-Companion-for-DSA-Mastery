import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  Plus,
  ArrowUp,
  Database,
  GitBranch,
  Layers,
  Network,
  Zap,
} from "lucide-react";
import GeometricIcon from "@/components/notes/geometricIcon";
import { themes } from "@/components/notes/themes";
import type { Theme } from "@/components/notes/types";

interface WelcomeScreenProps {
  welcomeRef: React.RefObject<HTMLDivElement | null>;
  initialInputRef: React.RefObject<HTMLTextAreaElement | null>;
  message: string;
  setMessage: (message: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  sendMessage: () => void;
  currentTheme: Theme;
}

export default function WelcomeScreen({
  welcomeRef,
  initialInputRef,
  message,
  setMessage,
  handleKeyPress,
  sendMessage,
  currentTheme,
}: WelcomeScreenProps) {
  const theme = themes[currentTheme];

  const dsaTopics = [
    { icon: Database, label: "Arrays" },
    { icon: GitBranch, label: "Linked Lists" },
    { icon: Layers, label: "Trees" },
    { icon: Network, label: "Graphs" },
    { icon: Zap, label: "Dynamic Programming" },
  ];

  const isDarkTheme =
    currentTheme === "midnight" ||
    currentTheme === "galaxy" ||
    currentTheme === "neon" ||
    currentTheme === "holographic";
  const isCoralTheme = currentTheme === "coral";

  return (
    <div
      ref={welcomeRef}
      className="flex-1 flex flex-col items-center justify-center px-6 relative z-10"
    >
      {/* Welcome message */}
      <div className="flex items-center mb-12">
        <div className="mr-4">
          <GeometricIcon currentTheme={currentTheme} />
        </div>
        <h1
          className={`text-3xl font-normal ${
            isCoralTheme
              ? "bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
              : currentTheme === "volcano"
                ? "bg-gradient-to-r from-red-700 to-yellow-600 bg-clip-text text-transparent"
                : currentTheme === "holographic"
                  ? "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-bold"
                  : currentTheme === "vintage"
                    ? "font-serif text-amber-900 drop-shadow-sm"
                    : theme.text
          }`}
        >
          Ready to create notes?
        </h1>
      </div>

      {/* Input box */}
      <div className="w-full max-w-2xl mb-8">
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
            ref={initialInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Which topics notes would you like to make?"
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
                <Paperclip
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
                  isCoralTheme || currentTheme === "vintage" ? "shadow-lg" : ""
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* DSA Topic pills */}
      <div className="flex flex-wrap gap-3 justify-center">
        {dsaTopics.map((topic, index) => (
          <Button
            key={index}
            variant="outline"
            className={`${
              isDarkTheme
                ? currentTheme === "holographic"
                  ? "bg-black/30 border-purple-400/50 text-white backdrop-blur-xl hover:bg-purple-500/20"
                  : "bg-slate-800 border-slate-700 text-white"
                : isCoralTheme
                  ? "bg-white/70 backdrop-blur-sm border-orange-200 text-gray-800 shadow-md"
                  : currentTheme === "arctic"
                    ? "bg-white/80 backdrop-blur-sm border-slate-300 text-slate-800 shadow-md"
                    : currentTheme === "volcano"
                      ? "bg-white/75 backdrop-blur-sm border-red-300 text-red-900 shadow-md"
                      : currentTheme === "vintage"
                        ? "bg-amber-50/80 backdrop-blur-sm border-amber-300 text-amber-900 shadow-lg font-serif"
                        : "bg-white border-gray-200 text-black"
            } ${
              theme.pill
            } rounded-full px-4 py-2 h-auto transition-all duration-200`}
            onClick={() => {
              setMessage(`Create notes on ${topic.label}`);
            }}
          >
            <topic.icon className={`w-4 h-4 mr-2 ${theme.iconColor}`} />
            {topic.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
