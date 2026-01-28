import type { Theme } from "@/components/notes/types";

interface GeometricIconProps {
  currentTheme: Theme;
}

export default function GeometricIcon({ currentTheme }: GeometricIconProps) {
  const getGradientColors = () => {
    switch (currentTheme) {
      case "nature":
        return { start: "#10b981", middle: "#14b8a6", end: "#06b6d4" };
      case "sunset":
        return { start: "#f97316", middle: "#ef4444", end: "#dc2626" };
      case "midnight":
        return { start: "#22d3ee", middle: "#3b82f6", end: "#1d4ed8" };
      case "ocean":
        return { start: "#3b82f6", middle: "#06b6d4", end: "#14b8a6" };
      case "rose":
        return { start: "#ec4899", middle: "#f43f5e", end: "#e11d48" };
      case "forest":
        return { start: "#22c55e", middle: "#65a30d", end: "#84cc16" };
      case "galaxy":
        return { start: "#a855f7", middle: "#d946ef", end: "#f472b6" };
      case "azure":
        return { start: "#1e40af", middle: "#3b82f6", end: "#60a5fa" };
      case "emerald":
        return { start: "#059669", middle: "#10b981", end: "#34d399" };
      case "coral":
        return { start: "#fbbf24", middle: "#f97316", end: "#dc2626" };
      case "arctic":
        return { start: "#64748b", middle: "#93c5fd", end: "#e2e8f0" };
      case "volcano":
        return { start: "#dc2626", middle: "#f97316", end: "#eab308" };
      case "neon":
        return { start: "#84cc16", middle: "#22d3ee", end: "#06b6d4" };
      case "holographic":
        return { start: "#a855f7", middle: "#ec4899", end: "#06b6d4" };
      case "vintage":
        return { start: "#d97706", middle: "#ea580c", end: "#dc2626" };
      default:
        return { start: "#6366f1", middle: "#8b5cf6", end: "#a855f7" };
    }
  };

  const colors = getGradientColors();
  const gradientId = `${currentTheme}Gradient`;

  return (
    <div className="w-8 h-8 relative">
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="50%" stopColor={colors.middle} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
          <radialGradient id={`${gradientId}Radial`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="50%" stopColor={colors.middle} />
            <stop offset="100%" stopColor={colors.end} />
          </radialGradient>
          {/* Holographic gradient */}
          <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="25%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="75%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          {/* Vintage pattern */}
          <pattern
            id="vintagePattern"
            x="0"
            y="0"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <rect width="4" height="4" fill="#d97706" opacity="0.1" />
            <circle cx="2" cy="2" r="0.5" fill="#ea580c" opacity="0.3" />
          </pattern>
        </defs>

        {/* Default - Hexagon with inner hexagon */}
        {currentTheme === "default" && (
          <>
            <path
              d="M16 2 L28 10 L28 22 L16 30 L4 22 L4 10 Z"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M16 6 L24 12 L24 20 L16 26 L8 20 L8 12 Z"
              fill="rgba(255,255,255,0.2)"
              stroke="none"
            />
          </>
        )}

        {/* Nature - Hexagon with circle */}
        {currentTheme === "nature" && (
          <>
            <path
              d="M16 2 L28 10 L28 22 L16 30 L4 22 L4 10 Z"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <circle cx="16" cy="16" r="6" fill="rgba(255,255,255,0.3)" />
          </>
        )}

        {/* Sunset - Diamond with inner diamond */}
        {currentTheme === "sunset" && (
          <>
            <path
              d="M16 2 L30 16 L16 30 L2 16 Z"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M16 6 L26 16 L16 26 L6 16 Z"
              fill="rgba(255,255,255,0.2)"
              stroke="none"
            />
          </>
        )}

        {/* Midnight - Rounded square with inner pattern */}
        {currentTheme === "midnight" && (
          <>
            <path
              d="M8 4 L24 4 L28 8 L28 24 L24 28 L8 28 L4 24 L4 8 Z"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M12 8 L20 8 L24 12 L24 20 L20 24 L12 24 L8 20 L8 12 Z"
              fill="rgba(255,255,255,0.2)"
              stroke="none"
            />
          </>
        )}

        {/* Ocean - Wave pattern */}
        {currentTheme === "ocean" && (
          <>
            <circle
              cx="16"
              cy="16"
              r="14"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M4 16 Q8 12 12 16 T20 16 T28 16"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M4 20 Q8 16 12 20 T20 20 T28 20"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M4 12 Q8 8 12 12 T20 12 T28 12"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              fill="none"
            />
          </>
        )}

        {/* Rose - Flower/petal pattern */}
        {currentTheme === "rose" && (
          <>
            <circle
              cx="16"
              cy="16"
              r="14"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M16 6 Q20 10 16 16 Q12 10 16 6"
              fill="rgba(255,255,255,0.3)"
            />
            <path
              d="M26 16 Q22 12 16 16 Q22 20 26 16"
              fill="rgba(255,255,255,0.3)"
            />
            <path
              d="M16 26 Q12 22 16 16 Q20 22 16 26"
              fill="rgba(255,255,255,0.3)"
            />
            <path
              d="M6 16 Q10 20 16 16 Q10 12 6 16"
              fill="rgba(255,255,255,0.3)"
            />
            <circle cx="16" cy="16" r="3" fill="rgba(255,255,255,0.5)" />
          </>
        )}

        {/* Forest - Tree/triangular pattern */}
        {currentTheme === "forest" && (
          <>
            <path
              d="M16 2 L28 16 L20 16 L26 26 L6 26 L12 16 L4 16 Z"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M16 6 L24 16 L18 16 L22 22 L10 22 L14 16 L8 16 Z"
              fill="rgba(255,255,255,0.2)"
              stroke="none"
            />
            <rect
              x="14"
              y="22"
              width="4"
              height="6"
              fill="rgba(255,255,255,0.3)"
            />
          </>
        )}

        {/* Galaxy - Star/cosmic pattern */}
        {currentTheme === "galaxy" && (
          <>
            <circle
              cx="16"
              cy="16"
              r="14"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M16 4 L18 12 L26 10 L20 16 L28 18 L20 20 L26 22 L18 20 L16 28 L14 20 L6 22 L12 16 L4 14 L12 12 L6 10 L14 12 Z"
              fill="rgba(255,255,255,0.4)"
              stroke="none"
            />
            <circle cx="16" cy="16" r="2" fill="rgba(255,255,255,0.8)" />
            <circle cx="12" cy="8" r="1" fill="rgba(255,255,255,0.6)" />
            <circle cx="24" cy="12" r="1" fill="rgba(255,255,255,0.6)" />
            <circle cx="8" cy="24" r="1" fill="rgba(255,255,255,0.6)" />
            <circle cx="20" cy="24" r="1" fill="rgba(255,255,255,0.6)" />
          </>
        )}

        {/* Azure - Hexagon with circle */}
        {currentTheme === "azure" && (
          <>
            <path
              d="M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <circle cx="16" cy="16" r="4" fill="rgba(255,255,255,0.9)" />
          </>
        )}

        {/* Emerald - Leaf/nature design */}
        {currentTheme === "emerald" && (
          <>
            <path
              d="M16 4 C24 4 28 12 28 16 C28 20 24 28 16 28 C8 28 4 20 4 16 C4 12 8 4 16 4 Z"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M12 12 L16 8 L20 12 L16 20 Z"
              fill="rgba(255,255,255,0.9)"
            />
          </>
        )}

        {/* Coral - Radial gradient with diamond */}
        {currentTheme === "coral" && (
          <>
            <circle
              cx="16"
              cy="16"
              r="14"
              fill={`url(#${gradientId}Radial)`}
              stroke="none"
            />
            <path
              d="M8 16 L16 8 L24 16 L16 24 Z"
              fill="rgba(255,255,255,0.3)"
            />
            <circle cx="16" cy="16" r="3" fill="rgba(255,255,255,0.8)" />
          </>
        )}

        {/* Arctic - Crystalline/ice pattern */}
        {currentTheme === "arctic" && (
          <>
            <circle
              cx="16"
              cy="16"
              r="14"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M16 4 L16 28 M4 16 L28 16 M8 8 L24 24 M24 8 L8 24"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.5"
            />
            <circle
              cx="16"
              cy="16"
              r="6"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
            <circle cx="16" cy="16" r="3" fill="rgba(255,255,255,0.8)" />
            <circle cx="16" cy="8" r="1.5" fill="rgba(255,255,255,0.7)" />
            <circle cx="16" cy="24" r="1.5" fill="rgba(255,255,255,0.7)" />
            <circle cx="8" cy="16" r="1.5" fill="rgba(255,255,255,0.7)" />
            <circle cx="24" cy="16" r="1.5" fill="rgba(255,255,255,0.7)" />
          </>
        )}

        {/* Volcano - Mountain/lava pattern */}
        {currentTheme === "volcano" && (
          <>
            <circle
              cx="16"
              cy="16"
              r="14"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M4 24 L8 16 L12 20 L16 8 L20 20 L24 16 L28 24 Z"
              fill="rgba(255,255,255,0.3)"
            />
            <path
              d="M14 12 L16 8 L18 12 L16 16 Z"
              fill="rgba(255,255,255,0.5)"
            />
            <circle cx="16" cy="10" r="2" fill="rgba(255,255,255,0.8)" />
            <path
              d="M14 14 Q16 12 18 14"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M13 18 Q16 16 19 18"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              fill="none"
            />
          </>
        )}

        {/* Neon - Circuit/tech pattern */}
        {currentTheme === "neon" && (
          <>
            <rect
              x="2"
              y="2"
              width="28"
              height="28"
              rx="4"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <path
              d="M6 16 L10 16 L10 12 L14 12 L14 16 L18 16 L18 12 L22 12 L22 16 L26 16"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M6 20 L10 20 L10 24 L14 24 L14 20 L18 20 L18 24 L22 24 L22 20 L26 20"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="8" cy="16" r="2" fill="rgba(0,0,0,0.5)" />
            <circle cx="16" cy="12" r="2" fill="rgba(0,0,0,0.5)" />
            <circle cx="24" cy="16" r="2" fill="rgba(0,0,0,0.5)" />
            <circle cx="16" cy="24" r="2" fill="rgba(0,0,0,0.5)" />
            <rect x="14" y="14" width="4" height="4" fill="rgba(0,0,0,0.6)" />
          </>
        )}

        {/* Holographic - 3D prismatic design with animated effects */}
        {currentTheme === "holographic" && (
          <>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="url(#holoGradient)"
              stroke="none"
              filter="url(#glow)"
            />
            <path
              d="M16 4 L28 12 L24 16 L28 20 L16 28 L4 20 L8 16 L4 12 Z"
              fill="rgba(255,255,255,0.2)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
            <path
              d="M16 8 L24 14 L20 16 L24 18 L16 24 L8 18 L12 16 L8 14 Z"
              fill="rgba(255,255,255,0.3)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1"
            />
            <circle cx="16" cy="16" r="4" fill="rgba(255,255,255,0.8)" />
            <circle cx="16" cy="16" r="2" fill="rgba(255,255,255,1)" />
          </>
        )}

        {/* Vintage - Ornate decorative design */}
        {currentTheme === "vintage" && (
          <>
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="url(#vintagePattern)"
              stroke="none"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              fill={`url(#${gradientId})`}
              stroke="none"
              opacity="0.8"
            />
            <path
              d="M16 4 C20 4 24 8 24 12 C28 12 28 20 24 20 C24 24 20 28 16 28 C12 28 8 24 8 20 C4 20 4 12 8 12 C8 8 12 4 16 4 Z"
              fill="rgba(255,255,255,0.3)"
              stroke="rgba(139,69,19,0.5)"
              strokeWidth="1"
            />
            <circle
              cx="16"
              cy="16"
              r="8"
              fill="none"
              stroke="rgba(139,69,19,0.4)"
              strokeWidth="1"
            />
            <circle cx="16" cy="16" r="4" fill="rgba(255,255,255,0.6)" />
            <path
              d="M12 12 L20 12 L20 20 L12 20 Z"
              fill="none"
              stroke="rgba(139,69,19,0.3)"
              strokeWidth="1"
            />
            <circle cx="12" cy="12" r="1" fill="rgba(139,69,19,0.5)" />
            <circle cx="20" cy="12" r="1" fill="rgba(139,69,19,0.5)" />
            <circle cx="20" cy="20" r="1" fill="rgba(139,69,19,0.5)" />
            <circle cx="12" cy="20" r="1" fill="rgba(139,69,19,0.5)" />
          </>
        )}
      </svg>
    </div>
  );
}
