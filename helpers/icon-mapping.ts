import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Code2,
  Layout,
  Server,
  Database,
  Wrench,
  Binary,
  Code,
  Cpu,
  Globe,
  Zap,
  Lightbulb,
  Rocket,
  Coffee,
  Sparkles,
  Heart,
  Music,
  Gamepad2,
  BookOpen,
} from "lucide-react";

// Mapping icon names to components
const iconComponents: Record<string, LucideIcon> = {
  Code2,
  Layout,
  Server,
  Database,
  Wrench,
  Binary,
  Code,
  Cpu,
  Globe,
  Zap,
  Lightbulb,
  Rocket,
  Coffee,
  Sparkles,
  Heart,
  Music,
  Gamepad2,
  BookOpen,
};

// For tech stack - icon name mapping
export const techStackIcons = {
  Code2: "Code2",
  Binary: "Binary",
  Layout: "Layout",
  Server: "Server",
  Database: "Database",
  Wrench: "Wrench",
  Code: "Code",
  Cpu: "Cpu",
  Globe: "Globe",
};

// For about section - icon name mapping
export const aboutIcons = {
  Code: "Code",
  Lightbulb: "Lightbulb",
  Rocket: "Rocket",
  Coffee: "Coffee",
  Sparkles: "Sparkles",
  Zap: "Zap",
  Heart: "Heart",
  Music: "Music",
  Gamepad2: "Gamepad2",
  BookOpen: "BookOpen",
  Cpu: "Cpu",
  Globe: "Globe",
};

// Icon mapping for projects
export const projectIconMap: Record<string, string> = {
  PHP: "Cpu",
  Laravel: "Code",
  MySQL: "Database",
  Tailwind: "Layout",
  Bootstrap: "Layout",
  MongoDB: "Database",
  Filament: "Code",
  Livewire: "Globe",
  Inertia: "Globe",
  Angular: "Globe",
  "Angular 9": "Globe",
  "Angular 18": "Globe",
  React: "Globe",
  Vue: "Globe",
  Javascript: "Cpu",
  Typescript: "Cpu",
  Redis: "Database",
  Linux: "Server",
  "Next.js": "Globe",
};

// Function to get the actual icon component based on name
export function getIconByName(name: string, className: string = "h-6 w-6") {
  const IconComponent = iconComponents[name];
  
  if (IconComponent) {
    return React.createElement(IconComponent, { className });
  }
  
  // Fallback to Code icon if the specified icon doesn't exist
  return React.createElement(Code, { className });
}