import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { themes } from "@/components/notes/themes";
import type { Theme } from "@/components/notes/types";

interface ThemeSelectorProps {
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void;
  showThemeSelector: boolean;
  setShowThemeSelector: (show: boolean) => void;
}

export default function ThemeSelector({
  currentTheme,
  setCurrentTheme,
  showThemeSelector,
  setShowThemeSelector,
}: ThemeSelectorProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className={`p-3 rounded-lg shadow-lg border-2 ${
            currentTheme === "midnight" ||
            currentTheme === "galaxy" ||
            currentTheme === "neon" ||
            currentTheme === "holographic"
              ? "bg-slate-800 border-slate-600 hover:bg-slate-700 text-white"
              : currentTheme === "vintage"
                ? "bg-amber-100 border-amber-400 hover:bg-amber-200 text-amber-900 shadow-xl"
                : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
          } ${
            currentTheme === "holographic"
              ? "holo-animate bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white border-purple-400"
              : ""
          }`}
        >
          <Palette className="w-5 h-5" />
          <span
            className={`ml-2 text-sm font-medium ${
              currentTheme === "vintage" ? "font-serif" : ""
            }`}
          >
            Themes
          </span>
        </Button>

        {showThemeSelector && (
          <div
            className={`absolute top-14 right-0 ${
              currentTheme === "midnight" ||
              currentTheme === "galaxy" ||
              currentTheme === "neon" ||
              currentTheme === "holographic"
                ? "bg-slate-800 border-slate-600"
                : currentTheme === "vintage"
                  ? "bg-amber-50 border-amber-300"
                  : "bg-white border-gray-300"
            } border-2 rounded-lg shadow-xl p-3 min-w-[220px] max-h-[600px] overflow-y-auto z-50`}
          >
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(themes).map(([key, themeData]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentTheme(key as Theme);
                    setShowThemeSelector(false);
                  }}
                  className={`text-left px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentTheme === key
                      ? key === "holographic"
                        ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg"
                        : `bg-gradient-to-r ${themeData.primary} text-white shadow-md`
                      : currentTheme === "midnight" ||
                          currentTheme === "galaxy" ||
                          currentTheme === "neon" ||
                          currentTheme === "holographic"
                        ? "hover:bg-slate-700 text-white"
                        : currentTheme === "vintage"
                          ? "hover:bg-amber-100 text-amber-900"
                          : "hover:bg-gray-100 text-gray-700"
                  } ${key === "vintage" ? "font-serif" : ""}`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        background:
                          key === "nature"
                            ? "linear-gradient(45deg, #10b981, #14b8a6)"
                            : key === "sunset"
                              ? "linear-gradient(45deg, #f97316, #ef4444)"
                              : key === "midnight"
                                ? "linear-gradient(45deg, #22d3ee, #3b82f6)"
                                : key === "ocean"
                                  ? "linear-gradient(45deg, #3b82f6, #06b6d4)"
                                  : key === "rose"
                                    ? "linear-gradient(45deg, #ec4899, #f43f5e)"
                                    : key === "forest"
                                      ? "linear-gradient(45deg, #22c55e, #65a30d)"
                                      : key === "galaxy"
                                        ? "linear-gradient(45deg, #a855f7, #d946ef)"
                                        : key === "azure"
                                          ? "linear-gradient(45deg, #1e40af, #3b82f6)"
                                          : key === "emerald"
                                            ? "linear-gradient(45deg, #059669, #10b981)"
                                            : key === "coral"
                                              ? "radial-gradient(circle, #fbbf24, #f97316)"
                                              : key === "arctic"
                                                ? "linear-gradient(45deg, #64748b, #93c5fd)"
                                                : key === "volcano"
                                                  ? "linear-gradient(45deg, #dc2626, #eab308)"
                                                  : key === "neon"
                                                    ? "linear-gradient(45deg, #84cc16, #22d3ee)"
                                                    : key === "holographic"
                                                      ? "linear-gradient(45deg, #a855f7, #ec4899, #3b82f6, #06b6d4)"
                                                      : key === "vintage"
                                                        ? "linear-gradient(45deg, #d97706, #ea580c)"
                                                        : "linear-gradient(45deg, #6366f1, #8b5cf6)",
                      }}
                    ></div>
                    <span className="text-xs">{themeData.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
