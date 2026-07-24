"use client"

import React from "react"
import { 
  Code2, 
  Binary, 
  Cpu, 
  GitFork, 
  Workflow, 
  Terminal, 
  Database,
  Globe
} from "lucide-react"

type IconProps = {
  className?: string
}

export function TechIcon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const normName = name.toLowerCase().trim()

  // 1. Programming Languages
  if (normName === "javascript" || normName === "js") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3H21V21H3V3Z" fill="#F7DF1E" />
        <path d="M12 18H14V12H12V18ZM17 18C18.1 18 19 17.1 19 16V13C19 11.9 18.1 11 17 11H15V18H17ZM17 13V16H18V13H17Z" fill="black" />
      </svg>
    )
  }
  
  if (normName === "typescript" || normName === "ts") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3H21V21H3V3Z" fill="#3178C6" />
        <path d="M10 18H12V12H10V18ZM15 18C16.1 18 17 17.1 17 16V13C17 11.9 16.1 11 15 11H13V18H15ZM15 13V16H16V13H15Z" fill="white" />
      </svg>
    )
  }

  if (normName === "php") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.3 12.3c-.3.6-.9.9-1.8.9h-1.6v-3.7h1.6c.9 0 1.5.3 1.8.9.3.6.4 1 .4 1.3 0 .4-.1.8-.4.6zm-5.7-3.7h1.6c.9 0 1.5.3 1.8.9.3.6.4 1 .4 1.3 0 .4-.1.8-.4.6-.3.6-.9.9-1.8.9H9.6v-3.7z" fill="#777BB4" />
      </svg>
    )
  }

  if (normName === "python") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.26 2c-1.84 0-3.3.16-4.24.47-2.14.7-2.22 2-2.22 3.84v1.54h6.58v.92H2.4c-1.84 0-3 .92-3.4 2.94-.47 2.3-.47 4.14 0 6.44.3 1.53 1.23 2.6 3.06 2.6h1.7v-2.3c0-2 1.52-3.7 3.52-3.7h5.98c1.68 0 3.06-1.38 3.06-3.06V5.84c0-1.84-.76-2.9-2.9-3.37C15.42 2.14 13.9 2 12.26 2z" fill="#3776AB" />
        <path d="M11.74 22c1.84 0 3.3-.16 4.24-.47 2.14-.7 2.22-2 2.22-3.84v-1.54h-6.58v-.92h9.98c1.84 0 3-.92 3.4-2.94.47-2.3.47-4.14 0-6.44-.3-1.53-1.23-2.6-3.06-2.6h-1.7v2.3c0 2-1.52 3.7-3.52 3.7H10.8c-1.68 0-3.06 1.38-3.06 3.06v5.22c0 1.84.76 2.9 2.9 3.37.86.32 2.38.46 4.02.46z" fill="#FFE873" />
      </svg>
    )
  }

  if (normName === "rust") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#DEA584" />
      </svg>
    )
  }

  // 2. Frontend Development
  if (normName === "react" || normName === "react.js") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
      </svg>
    )
  }

  if (normName === "next.js" || normName === "nextjs") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="black" stroke="white" strokeWidth="0.8" />
        <path d="M7 16V8.5H8.6L14.8 15.6V8.5H16V16H14.4L8.2 8.9V16H7Z" fill="white" />
      </svg>
    )
  }

  if (normName === "tailwind css" || normName === "tailwind") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5.5C9.333 8.167 7.333 9.5 6 9.5c-2 0-3-1-3-3s1-3.5 3.5-3.5C9 3 10.333 4 12 5.5zm6 4.5c-1.333 1.333-3.333 2-4.667 2-2 0-3-1-3-3s1-3.5 3.5-3.5c2.5 0 3.833 1 5.5 2.5z" fill="#38BDF8" />
        <path d="M6 14.5c1.333-1.333 3.333-2 4.667-2 2 0 3 1 3 3s-1 3.5-3.5 3.5c-2.5 0-3.833-1-5.5-2.5zm12-4.5c2.667-2.667 4.667-4 6-4 2 0 3 1 3 3s-1 3.5-3.5 3.5C21 12.5 19.667 11.5 18 10z" fill="#0EA5E9" />
      </svg>
    )
  }

  if (normName === "vue" || normName === "vue.js") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 18.5L3 3H7.5L12 10.8L16.5 3H21L12 18.5Z" fill="#41B883" />
        <path d="M12 18.5L6.2 8.5H9.6L12 12.5L14.4 8.5H17.8L12 18.5Z" fill="#35495E" />
      </svg>
    )
  }

  if (normName === "angular") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 5.2V13.8L12 21L21 13.8V5.2L12 2Z" fill="#DD0031" />
        <path d="M12 3.8L19.5 13.8H16.8L15 9.8H9L7.2 13.8H4.5L12 3.8ZM12 5.8L10 10.5H14L12 5.8Z" fill="white" />
      </svg>
    )
  }

  if (normName === "livewire") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12H7L9 16L12 7L14 12H21" stroke="#FB70A9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (normName === "html/css" || normName === "html" || normName === "css") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3L5 19L12 21L19 19L21 3H3ZM16.8 7.5L16.4 11.2H9.2L9.4 12.8H16.2L15.6 16.5L12 17.5L8.4 16.5L8.2 14.8H10L10.1 15.2L12 15.7L13.9 15.2L14.2 12.8H8V11.2H14.4L14.8 7.5H3.5" fill="#E34F26" />
      </svg>
    )
  }

  // 3. Backend Development
  if (normName === "node.js" || normName === "nodejs" || normName === "node") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4.5 6.3V15L12 19.3L19.5 15V6.3L12 2Z" stroke="#339933" strokeWidth="1.5" />
        <path d="M12 5.5L6.5 8.7V14.3L12 17.5L17.5 14.3V8.7L12 5.5Z" fill="#339933" opacity="0.6" />
        <circle cx="12" cy="11.5" r="1.5" fill="white" />
      </svg>
    )
  }

  if (normName === "laravel") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 3.5L12 7V20.5L5.5 17V3.5Z" fill="#FF2D20" />
        <path d="M18.5 3.5L12 7V20.5L18.5 17V3.5Z" fill="#E32519" />
        <path d="M12 2L18.5 5.5V17L12 20.5L5.5 17V5.5L12 2Z" stroke="white" strokeWidth="1.2" />
      </svg>
    )
  }

  if (normName === "express" || normName === "express.js") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#4a5568" />
        <text x="50%" y="58%" fill="white" fontSize="10px" fontWeight="black" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">EX</text>
      </svg>
    )
  }

  // 4. Databases
  if (normName === "postgresql" || normName === "postgres") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.63 2 5.37 3.5 3.29 6C2 7.55 2.13 9 2.13 9C2.13 9 3.5 8 5.62 8.71C7.75 9.42 9.56 12 9.56 12.87C9.56 13.74 8.75 16.35 11.23 18.23C13.71 20.11 16 19.33 17.65 18C19.3 16.67 21 14 21 10.3C21 6.6 17.5 2 12 2Z" fill="#4169E1" />
        <circle cx="15.5" cy="9.5" r="1" fill="white" />
      </svg>
    )
  }

  if (normName === "mongodb" || normName === "mongo") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.5 4.5 8 8 8 11.5C8 15 10 18.5 12 22C14 18.5 16 15 16 11.5C16 8 13.5 4.5 12 2Z" fill="#47A248" />
        <path d="M12 2C11.3 4.5 10.5 8 10.5 11.5C10.5 15 11.3 18.5 12 22V2Z" fill="#3F3F3F" opacity="0.3" />
      </svg>
    )
  }

  if (normName === "mysql") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3C7 3 3 5 3 7V17C3 19 7 21 12 21C17 21 21 19 21 17V7C21 5 17 3 12 3Z" fill="#00758F" />
        <path d="M12 3C7 3 3 4.5 3 6V7.5C3 9 7 10.5 12 10.5C17 10.5 21 9 21 7.5V6C21 4.5 17 3 12 3Z" fill="#F29111" opacity="0.8" />
        <path d="M3 11V12.5C3 14 7 15.5 12 15.5C17 15.5 21 14 21 12.5V11C21 12.5 17 14 12 14C7 14 3 12.5 3 11Z" fill="white" opacity="0.4" />
      </svg>
    )
  }

  // 5. Development Tools
  if (normName === "git") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 12L12 2.5L21.5 12L12 21.5L2.5 12Z" fill="#F05032" />
        <circle cx="12" cy="12" r="2.2" fill="white" />
        <circle cx="12" cy="7.2" r="2.2" fill="white" />
        <path d="M12 9.4V12" stroke="white" strokeWidth="1.5" />
        <circle cx="15.5" cy="12" r="2.2" fill="white" />
        <path d="M12 12H13.3" stroke="white" strokeWidth="1.5" />
      </svg>
    )
  }

  if (normName === "docker") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 12C2.5 16.5 6.5 20.5 12 20.5C17.5 20.5 21.5 16.5 21.5 12C21.5 10 20.5 8.2 19 7L17 8.5C18.2 9.5 19 11 19 12.5C19 15.5 16 18.5 12 18.5C8 18.5 5 15.5 5 12.5C5 11 5.8 9.5 7 8.5L5 7C3.5 8.2 2.5 10 2.5 12Z" fill="#0db7ed" />
        {/* container boxes */}
        <rect x="7.5" y="10.5" width="2" height="2" fill="#0db7ed" />
        <rect x="10.5" y="10.5" width="2" height="2" fill="#0db7ed" />
        <rect x="13.5" y="10.5" width="2" height="2" fill="#0db7ed" />
        <rect x="10.5" y="7.5" width="2" height="2" fill="#0db7ed" />
      </svg>
    )
  }

  if (normName === "jenkins") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#D24939" />
        <rect x="10.5" y="6" width="3" height="9" fill="white" />
        <circle cx="12" cy="13.5" r="1.5" fill="black" />
        <rect x="8.5" y="10" width="7" height="1.5" fill="white" />
      </svg>
    )
  }

  if (normName === "linux/unix" || normName === "linux" || normName === "unix") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8 2 4.5 5 4.5 9C4.5 11.5 5.5 13.5 7.5 15V17L12 19L16.5 17V15C18.5 13.5 19.5 11.5 19.5 9C19.5 5 16 2 12 2Z" fill="#1F2937" />
        <circle cx="9.5" cy="8.5" r="1.5" fill="#FFE873" />
        <circle cx="14.5" cy="8.5" r="1.5" fill="#FFE873" />
        <path d="M9.5 13C10.5 14 13.5 14 14.5 13" stroke="#FFE873" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  // 6. Generic concept icons
  if (normName.includes("data structure")) return <Binary className={className} />
  if (normName.includes("algorithm")) return <Workflow className={className} />
  if (normName.includes("oop") || normName.includes("object oriented")) return <Cpu className={className} />
  if (normName.includes("system design")) return <GitFork className={className} />

  // 7. General concept fallbacks
  return <Code2 className={className} />
}
