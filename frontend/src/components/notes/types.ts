export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export type Theme =
  | "default"
  | "nature"
  | "sunset"
  | "midnight"
  | "ocean"
  | "rose"
  | "forest"
  | "galaxy"
  | "azure"
  | "emerald"
  | "coral"
  | "arctic"
  | "volcano"
  | "neon"
  | "holographic"
  | "vintage";

export interface ThemeConfig {
  name: string;
  primary: string;
  primaryHover: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  hover: string;
  pill: string;
  iconColor: string;
}