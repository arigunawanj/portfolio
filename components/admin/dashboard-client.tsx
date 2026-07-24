"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"
import { 
  Sparkles, 
  Settings, 
  Eye, 
  CheckCircle2, 
  Terminal, 
  Activity, 
  Cpu, 
  ChevronRight, 
  Database 
} from "lucide-react"

// Mock statistics data for Recharts chart
const MOCK_ANALYTICS_DATA = [
  { day: "Mon", requests: 120, latency: 45, load: 30 },
  { day: "Tue", requests: 180, latency: 50, load: 38 },
  { day: "Wed", requests: 250, latency: 42, load: 45 },
  { day: "Thu", requests: 210, latency: 38, load: 40 },
  { day: "Fri", requests: 310, latency: 40, load: 55 },
  { day: "Sat", requests: 390, latency: 35, load: 68 },
  { day: "Sun", requests: 430, latency: 32, load: 72 },
]

type DashboardClientProps = {
  counts: {
    projects: number
    experience: number
    education: number
    certifications: number
    techCategories: number
    traits: number
    users: number
  }
  profile: any
}

export default function DashboardClient({ counts, profile }: DashboardClientProps) {
  const [logs, setLogs] = useState<string[]>([
    "[15:44:01] [SYSTEM] Core initialization initialized.",
    "[15:44:02] [DB] Connection to MySQL instance verified.",
    "[15:44:03] [SYNC] Loaded active content categories configuration.",
    "[15:44:04] [INFO] Validator cluster consensus standing by."
  ])
  const logFeedRef = useRef<HTMLDivElement>(null)

  // Simulation of live admin system action log outputs
  useEffect(() => {
    const logPool = [
      "[DB] Handshake complete. Profile settings loaded.",
      "[API] GET /api/projects - 200 OK (Cache HIT)",
      "[INFO] purging CDN cache layers... success.",
      "[SECURITY] Session validated for administrator.",
      "[SYNC] Syncing assets repository commits.",
      "[DB] Refreshed analytics aggregates view.",
      "[SYSTEM] Network traffic distribution optimal."
    ]

    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false })
      const selectedLog = logPool[Math.floor(Math.random() * logPool.length)]
      setLogs((prev) => [...prev.slice(-15), `[${timestamp}] ${selectedLog}`])
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll logs
  useEffect(() => {
    if (logFeedRef.current) {
      logFeedRef.current.scrollTop = logFeedRef.current.scrollHeight
    }
  }, [logs])

  const cards = [
    { label: "Projects", count: counts.projects, href: "/admin/projects", color: "from-indigo-500 to-violet-600" },
    { label: "Work Experience", count: counts.experience, href: "/admin/experience", color: "from-violet-500 to-purple-600" },
    { label: "Education", count: counts.education, href: "/admin/education", color: "from-teal-500 to-emerald-600" },
    { label: "Certifications", count: counts.certifications, href: "/admin/certifications", color: "from-amber-500 to-orange-600" },
    { label: "Tech Stack", count: counts.techCategories, href: "/admin/tech-stack", color: "from-blue-500 to-indigo-600" },
    { label: "About Traits", count: counts.traits, href: "/admin/about", color: "from-rose-500 to-pink-600" },
    { label: "Admin Users", count: counts.users, href: "/admin/users", color: "from-slate-500 to-zinc-600" },
  ]

  const hasSEO = !!(profile?.metaKeywords && profile?.heroDescription)
  const hasSocials = !!(profile?.githubUrl || profile?.linkedinUrl)
  const hasCustomLogo = !!profile?.logoUrl && profile.logoUrl !== "/placeholder-logo.svg"

  return (
    <div className="space-y-8">
      {/* Top Banner Cockpit */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-linear-to-br from-card/30 via-card/10 to-card/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <BorderBeam size={200} duration={12} colorFrom="var(--pf-coral)" colorTo="var(--pf-teal-glow)" borderWidth={1.5} />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Antigravity Core
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Hello, <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-400 font-black">{profile?.name || "Administrator"}</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Your system console is connected. All engines are running smoothly. From here you can sort projects, tweak SEO indexes, and manage content live.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/admin/profile"
                className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-bold transition shadow-lg shadow-primary/20"
              >
                <Settings className="h-4 w-4" /> Branding & SEO Settings
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition"
              >
                <Eye className="h-4 w-4" /> Live Website ↗
              </a>
            </div>
          </div>

          {/* Core System Indicators */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              ["System Status", "ONLINE", CheckCircle2, "text-emerald-400", "API latency: 12ms"],
              ["SEO Indexing", hasSEO ? "READY" : "WARN", CheckCircle2, hasSEO ? "text-emerald-400" : "text-amber-400", hasSEO ? "Metadata loaded" : "Fill meta values"],
              ["Social Links", hasSocials ? "LINKED" : "EMPTY", CheckCircle2, hasSocials ? "text-emerald-400" : "text-slate-400", hasSocials ? "Accounts configured" : "No links set"],
              ["Branded Logo", hasCustomLogo ? "ACTIVE" : "DEFAULT", CheckCircle2, hasCustomLogo ? "text-emerald-400" : "text-slate-400", hasCustomLogo ? "Custom logo file" : "Standard generic"],
            ].map(([title, val, Icon, col, sub]) => (
              <div key={title} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 backdrop-blur-xs">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${col}`} />
                  <span className="text-xs font-black text-white">{val}</span>
                </div>
                <p className="text-[9px] text-muted-foreground/80">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Diagnostics and Server Logs widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recharts System Load Graph Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-white/5 bg-linear-to-b from-white/5 to-white/0 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              <span>Consensus Diagnostics Load</span>
            </h3>
            <span className="text-[10px] font-mono-pf text-muted-foreground">Requests/sec: 14.8 avg</span>
          </div>
          
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip contentStyle={{ background: "rgba(10, 13, 22, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
                <Area type="monotone" dataKey="load" stroke="#10b981" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Diagnostics Server Logs */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-white/5 bg-linear-to-b from-white/5 to-white/0 backdrop-blur-md flex flex-col h-[328px]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4 shrink-0">
            <Terminal className="h-4 w-4 text-primary animate-pulse" />
            <span>Antigravity Server Live Logs</span>
          </h3>
          
          <div 
            ref={logFeedRef}
            className="flex-1 overflow-y-auto space-y-2 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono-pf text-[10px] text-muted-foreground select-text scrollbar-thin"
          >
            {logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed break-all">
                {log.includes("[DB]") && <span className="text-indigo-400 font-bold">{log}</span>}
                {log.includes("[API]") && <span className="text-emerald-400">{log}</span>}
                {log.includes("[SECURITY]") && <span className="text-rose-400 font-bold">{log}</span>}
                {!log.includes("[DB]") && !log.includes("[API]") && !log.includes("[SECURITY]") && <span>{log}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Portfolio Modules</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link 
              key={card.label} 
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition hover:bg-white/10 hover:border-white/10"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-muted-foreground group-hover:text-white transition uppercase tracking-wider">{card.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-3xl font-black text-white font-mono-pf">{card.count}</div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${card.color} opacity-75`} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
