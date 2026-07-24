"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { PortfolioData } from "@/lib/portfolio-data"
import { Hero } from "./sections/hero"
import { Tech } from "./sections/tech"
import { Projects } from "./sections/projects"
import { Experience } from "./sections/experience"
import { Contact } from "./sections/contact"
import { Hud } from "./hud"
import { useScrollTimeline } from "./use-scroll-timeline"
import { Terminal, Sparkles, ChevronDown, Award, Play, CheckCircle2, FileText } from "lucide-react"
import { toast, Toaster } from "sonner"

const SceneCanvas = dynamic(() => import("./scene-canvas"), { ssr: false })

type AppearanceVM = { motionLevel: string; enable3D: boolean; accentColor: string }
const SCENES = ["hero", "tech", "projects", "experience", "contact"]

export function Portfolio3D({ data, appearance }: { data: PortfolioData; appearance: AppearanceVM }) {
  const [reduced, setReduced] = useState(false)
  const [blockHeight, setBlockHeight] = useState(15428902)
  const [gasPrice, setGasPrice] = useState(24)
  const [isConsoleOpen, setIsConsoleOpen] = useState(false)
  
  // Gamification & Quest states
  const [mintedCount, setMintedCount] = useState(0)
  const [scannedCategories, setScannedCategories] = useState<string[]>([])
  const [auditedProjects, setAuditedProjects] = useState<number[]>([])
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportTriggered, setReportTriggered] = useState(false)
  
  // Terminal commands state
  const [inputCmd, setInputCmd] = useState("")
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Initiating validator node console...",
    "[SYSTEM] Handshake complete. Node validator-ari-jatmiko: ACTIVE",
    "[QUEST] Consensus quest tracking active. Type 'help' to examine available CLI diagnostics.",
    "[EPOCH] Round #4501 active. Ready to scan stack protocols."
  ])
  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(m.matches)
    const fn = () => setReduced(m.matches)
    m.addEventListener("change", fn)
    document.documentElement.style.setProperty("--pf-coral", appearance.accentColor)
    return () => m.removeEventListener("change", fn)
  }, [appearance.accentColor])

  // Web3 network statistics simulations
  useEffect(() => {
    // Tick blocks count
    const blockInterval = setInterval(() => {
      setBlockHeight((h) => h + 1)
      const mockHash = Math.random().toString(16).substring(2, 10)
      const consensusNodes = ["ConsensusNode#882", "ValidatorPool#12", "GethNode#491"]
      const selectedNode = consensusNodes[Math.floor(Math.random() * consensusNodes.length)]
      
      setLogs((prev) => [
        ...prev.slice(-35),
        `[EPOCH] Block #${blockHeight + 1} validated by ${selectedNode}`,
        `[LEDGER] TxHash: 0x${mockHash}...confirmed.`
      ])
    }, 7000)

    // Tick gas cost fluctuations
    const gasInterval = setInterval(() => {
      setGasPrice((g) => {
        const delta = Math.floor(Math.random() * 5) - 2
        return Math.max(12, Math.min(65, g + delta))
      })
    }, 4500)

    return () => {
      clearInterval(blockInterval)
      clearInterval(gasInterval)
    }
  }, [blockHeight])

  // Scroll to bottom of terminal logger automatically
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs, isConsoleOpen])

  // Gamification Node Levels
  const getNodeLevel = (count: number) => {
    if (count < 2) return { name: "Candidate Node", level: 1, class: "text-slate-400" }
    if (count < 5) return { name: "Active Validator", level: 2, class: "text-teal-400 font-bold" }
    if (count < 8) return { name: "Consensus Master", level: 3, class: "text-indigo-400 font-black animate-pulse" }
    return { name: "Master Ledger Engine", level: 4, class: "text-emerald-400 font-black animate-bounce" }
  }
  const nodeLevel = getNodeLevel(mintedCount)

  // Quest callbacks
  const handleScanCategory = (key: string) => {
    setScannedCategories((prev) => {
      if (prev.includes(key)) return prev
      const next = [...prev, key]
      setLogs((l) => [...l, `[QUEST] Protocol scanned: category_${key.toLowerCase()}`])
      return next
    })
  }

  const handleAuditProject = (id: number) => {
    setAuditedProjects((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      setLogs((l) => [...l, `[QUEST] Ledger project audited: block_prj_${next.length}`])
      return next
    })
  }

  // Manual blocks minter / Click-to-mint handler
  const mintBlock = () => {
    const nextBlock = blockHeight + 1
    setBlockHeight(nextBlock)
    const mockHash = Math.random().toString(16).substring(2, 10)
    
    setMintedCount((prev) => {
      const nextCount = prev + 1
      const oldLvl = getNodeLevel(prev).name
      const newLvl = getNodeLevel(nextCount).name
      if (oldLvl !== newLvl) {
        setTimeout(() => {
          toast.success("Validator Level Up!", {
            description: `Congratulations! Your node has upgraded to ${newLvl}.`,
            icon: <Award className="h-5 w-5 text-emerald-400 animate-bounce" />
          })
        }, 600)
      }
      return nextCount
    })

    setLogs((prev) => [
      ...prev,
      `[MINTER] Minting block #${nextBlock}...`,
      `[0xAri] Validator Ari Gunawan Jatmiko signing commitment...`,
      `[SUCCESS] Block #${nextBlock} securely sealed on-chain! Hash: 0x${mockHash}`
    ])
    
    toast.success(`Block #${nextBlock} Minted Successfully!`, {
      description: `Validator nodes signed hash: 0x${mockHash}`,
      icon: <Sparkles className="h-4 w-4 text-emerald-500" />
    })
  }

  // Interactive Unix CLI Command Parser
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCmd = inputCmd.trim().toLowerCase()
    if (!cleanCmd) return

    setLogs((l) => [...l, `> ${inputCmd}`])
    setInputCmd("")

    switch (cleanCmd) {
      case "help":
        setLogs((l) => [
          ...l,
          "Consensus CLI Commands Available:",
          "  help     - Display execution directory.",
          "  skills   - Scan registered stack developer protocols.",
          "  projects - Check compiled project deployments summaries.",
          "  mint     - Forge a new validated genesis block on-chain.",
          "  clear    - Flush and clear console logs.",
          "  quest    - View current validation task check aggregates."
        ])
        break
      case "skills":
        const skillsFeed = data.tech.map(t => `  * ${t.title}: ${t.skills.map(s => s.name).join(", ")}`)
        setLogs((l) => [
          ...l,
          "[SYSTEM] Indexing protocol modules...",
          ...skillsFeed,
          `[SUCCESS] Found ${data.tech.length} skill sectors verified.`
        ])
        break
      case "projects":
        const projectsFeed = data.projects.map(p => `  * ${p.title} - tags: [${p.tags.slice(0, 3).join(", ")}]`)
        setLogs((l) => [
          ...l,
          "[SYSTEM] Fetching smart deployments...",
          ...projectsFeed,
          `[SUCCESS] Loaded ${data.projects.length} repository blocks.`
        ])
        break
      case "mint":
        mintBlock()
        break
      case "clear":
        setLogs([])
        break
      case "quest":
        setLogs((l) => [
          ...l,
          "=== CONSENSUS QUEST REPORT ===",
          `1. Synchronize Ledger: ${isSyncComplete ? "COMPLETE [✓]" : `IN_PROGRESS (${syncProgress}%)`}`,
          `2. Scan Stack Protocols: ${isScanComplete ? "COMPLETE [✓]" : `IN_PROGRESS (${scannedCategories.length}/3 categories)`}`,
          `3. Audit Deployments: ${isAuditComplete ? "COMPLETE [✓]" : `IN_PROGRESS (${auditedProjects.length}/2 projects)`}`,
          `4. Sign Genesis Block: ${isMintComplete ? "COMPLETE [✓]" : "IN_PROGRESS (0/1 taps)"}`,
          `TOTAL STATUS: ${completedQuestsCount}/4 tasks validated.`
        ])
        break
      default:
        setLogs((l) => [...l, `[ERROR] Unknown parameter: '${cleanCmd}'. Type 'help' to display valid targets.`])
        break
    }
  }

  const use3D = appearance.enable3D && appearance.motionLevel !== "off" && !reduced
  const { activeScene, progress } = useScrollTimeline(use3D)

  // Calculate total scroll progress (percentage from 0 to 100)
  const sceneIndex = SCENES.indexOf(activeScene)
  const syncProgress = Math.min(100, Math.floor(((sceneIndex + progress) / SCENES.length) * 100))

  // Gamification Quest checklist items validation
  const isSyncComplete = syncProgress >= 95
  const isScanComplete = scannedCategories.length >= 3
  const isAuditComplete = auditedProjects.length >= 2
  const isMintComplete = mintedCount >= 1

  const completedQuestsCount = (isSyncComplete ? 1 : 0) + (isScanComplete ? 1 : 0) + (isAuditComplete ? 1 : 0) + (isMintComplete ? 1 : 0)
  const isQuestsFinished = completedQuestsCount === 4

  // Open final verification report once when all quests are complete
  useEffect(() => {
    if (isQuestsFinished && !reportTriggered) {
      setReportTriggered(true)
      setIsReportOpen(true)
      setLogs((prev) => [
        ...prev,
        "[CONGRATS] Validator Node validation handshake COMPLETE!",
        "[SYSTEM] Verified credential report unlocked."
      ])
      toast.success("Handshake verified successfully!", {
        description: "Verified node validator report created.",
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-bounce" />
      })
    }
  }, [isQuestsFinished, reportTriggered])

  return (
    <main id="main" className="relative w-full" style={{ background: "var(--pf-bg-deep)" }}>
      <a href="#hero-scene" className="pf-skip-link">Skip to content</a>
      
      {use3D ? (
        <SceneCanvas scene={activeScene} accent={appearance.accentColor} onBlockClick={mintBlock} />
      ) : (
        <div className="fixed inset-0 -z-0" style={{ background: "radial-gradient(circle at 50% 30%, var(--pf-bg-panel), var(--pf-bg-deep))" }} />
      )}
      
      <div className="pf-grid-overlay" aria-hidden />

      {/* Gamified top sync progress loader bar */}
      <div className="fixed top-0 left-0 h-0.5 bg-linear-to-r from-primary to-emerald-400 z-50 transition-all duration-300 shadow-lg shadow-primary/50" style={{ width: `${syncProgress}%` }} />

      {/* Modern responsive Web3 HUD Status Bar - Refined & Subtle */}
      <div className="fixed top-0 inset-x-0 z-40 bg-black/10 backdrop-blur-xs px-6 py-2.5 flex items-center justify-between font-mono-pf text-[9px] tracking-widest" style={{ color: "var(--pf-muted-fg)" }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-xs" />
            <span className="opacity-80">net: mainnet</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1.5">
            <span className="opacity-60">sync:</span>
            <span className="text-white/80 font-bold">{syncProgress}%</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5">
            <span className="opacity-60">node_level:</span>
            <span className={nodeLevel.class}>{nodeLevel.name}</span>
          </div>
          
          {isQuestsFinished && (
            <div className="hidden sm:flex items-center gap-1 text-emerald-400 font-bold uppercase animate-pulse">
              <CheckCircle2 className="h-3.5 w-3.5" /> verified
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-5 opacity-75">
          <span>gas: <span className="text-white/80">{gasPrice} gwei</span></span>
          <span>epoch: <span className="text-white/80">#4501</span></span>
          <span className="hidden md:inline">blocks: <span className="text-white/80">{blockHeight.toLocaleString()}</span></span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={mintBlock}
            className="px-3 h-6 rounded-md bg-linear-to-r from-primary to-indigo-500 hover:from-primary/95 hover:to-indigo-500/95 text-white font-bold tracking-tight shadow-md hover:shadow-primary/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Play className="h-2.5 w-2.5 fill-current" /> MINT_BLOCK
          </button>
          
          <button 
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className="px-2 h-6 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Terminal className="h-3 w-3" />
            <span>CONSOLE</span>
          </button>
        </div>
      </div>

      <Hero contact={data.contact} aboutTraits={data.aboutTraits} funFacts={data.funFacts} />
      <Tech tech={data.tech} onScanCategory={handleScanCategory} />
      <Projects projects={data.projects} onAuditProject={handleAuditProject} />
      <Experience experiences={data.experiences} education={data.education} certifications={data.certifications} />
      <Contact contact={data.contact} />
      
      <Hud active={activeScene} scenes={SCENES} />

      {/* Gamified 100% Synced Badge (Bottom Left) */}
      <AnimatePresence>
        {isSyncComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -50 }}
            onClick={() => { if (isQuestsFinished) setIsReportOpen(true) }}
            className={`fixed bottom-6 left-6 z-30 p-4 rounded-xl border bg-black/85 backdrop-blur-md shadow-2xl flex items-center gap-3 font-mono-pf text-[10px] select-none ${isQuestsFinished ? "cursor-pointer hover:border-emerald-500 transition-all duration-300" : ""}`}
            style={{ borderColor: isQuestsFinished ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.05)" }}
          >
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold ${isQuestsFinished ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 animate-bounce" : "bg-white/5 border-white/10 text-slate-500 animate-pulse"}`}>✓</div>
            <div>
              <p className="font-bold text-white uppercase tracking-wider">
                {isQuestsFinished ? "Report Generated" : "Consensus Synced"}
              </p>
              <p className={isQuestsFinished ? "text-emerald-400 font-bold" : "text-muted-foreground"}>
                {isQuestsFinished ? "Click to view validated report" : "Verification in progress"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Web3 Validator Console Drawer (Bottom Right) */}
      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col font-mono-pf"
            style={{ 
              background: "rgba(10, 13, 22, 0.92)",
              height: "380px"
            }}
          >
            {/* Header console drawer */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs font-bold bg-white/2" style={{ color: "var(--pf-sand)" }}>
              <div className="flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-primary" />
                <span>Validator Cockpit v1.0</span>
              </div>
              <button 
                onClick={() => setIsConsoleOpen(false)}
                className="p-1 rounded-md hover:bg-white/5 cursor-pointer text-muted-foreground hover:text-white"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Gamified Quest Checklist */}
            <div className="p-3 border-b border-white/10 bg-white/5 space-y-1.5 text-[9px] shrink-0">
              <div className="flex justify-between items-center text-primary font-bold">
                <span>VALIDATOR QUEST CHECKLIST</span>
                <span>({completedQuestsCount}/4)</span>
              </div>
              <div className="space-y-1 text-[8.5px] font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className={isSyncComplete ? "text-emerald-400" : "text-slate-500"}>
                    {isSyncComplete ? "✓" : "○"} 1. Sync Ledger (Scroll: {syncProgress}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={isScanComplete ? "text-emerald-400" : "text-slate-500"}>
                    {isScanComplete ? "✓" : "○"} 2. Scan Stack Protocols ({scannedCategories.length}/3)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={isAuditComplete ? "text-emerald-400" : "text-slate-500"}>
                    {isAuditComplete ? "✓" : "○"} 3. Audit Deployments ({auditedProjects.length}/2)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={isMintComplete ? "text-emerald-400" : "text-slate-500"}>
                    {isMintComplete ? "✓" : "○"} 4. Sign Genesis Block (Taps: {mintedCount}/1)
                  </span>
                </div>
              </div>
            </div>

            {/* Logs activity streams */}
            <div 
              ref={logContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-2 text-[10px] select-text scrollbar-thin scrollbar-thumb-white/10"
              style={{ color: "var(--pf-sand)" }}
            >
              {logs.map((log, idx) => {
                let color = "text-muted-foreground"
                if (log.startsWith("[SUCCESS]")) color = "text-emerald-400 font-bold"
                if (log.startsWith("[SYSTEM]")) color = "text-primary font-bold"
                if (log.startsWith("[QUEST]")) color = "text-teal-400 font-bold"
                if (log.startsWith("[MINTER]")) color = "text-primary"
                return (
                  <div key={idx} className={`${color} leading-relaxed break-all`}>
                    {log}
                  </div>
                )
              })}
            </div>

            {/* Interactive CLI Text Input form */}
            <form onSubmit={handleCommandSubmit} className="p-2 border-t border-white/10 flex items-center bg-black/40 shrink-0">
              <span className="text-primary text-[10px] mr-1.5 font-bold">&gt;</span>
              <input 
                type="text"
                value={inputCmd}
                onChange={(e) => setInputCmd(e.target.value)}
                placeholder="type command (e.g. help, skills, quest)..."
                className="flex-1 bg-transparent border-none outline-hidden text-[10px] text-white font-mono-pf placeholder-white/20 focus:ring-0"
              />
            </form>

            {/* Quick dashboard status */}
            <div className="p-3 border-t border-white/10 text-[9px] flex items-center justify-between shrink-0" style={{ background: "rgba(0, 0, 0, 0.2)", color: "var(--pf-muted-fg)" }}>
              <span>Uptime: <span className="text-emerald-400 font-bold">99.98%</span></span>
              <span>Gas Price: <span className="text-white font-bold">{gasPrice} Gwei</span></span>
              <span>Validated: <span className="text-white font-bold">{blockHeight.toLocaleString()}</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamification Success Report Overlay Modal */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-linear-to-b from-[#0f131d] to-[#080b11] shadow-2xl font-mono-pf text-xs space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">Validation Handshake Verified</h3>
                <p className="text-[10px] text-muted-foreground">GENESIS COMMIT HASH: 0x7f0bce3f3a9e102</p>
              </div>

              {/* Verified metadata log */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 text-[10px]">
                <div className="flex justify-between"><span className="text-muted-foreground">NODE_VALIDATOR:</span> <span className="text-white font-bold">Ari Gunawan Jatmiko</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">NODE_LEVEL:</span> <span className={`${nodeLevel.class} font-bold`}>{nodeLevel.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">CONSENSUS_SYNC:</span> <span className="text-emerald-400 font-bold">100% SUCCESS</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">STACK_SCAN:</span> <span className="text-white font-bold">{scannedCategories.length} Categories Scanned</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">PROJECTS_AUDITED:</span> <span className="text-white font-bold">{auditedProjects.length} Deployments Audited</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">BLOCKS_SIGNED:</span> <span className="text-white font-bold">{mintedCount} Blocks Signed</span></div>
              </div>

              {/* Profile synopsis */}
              <div className="space-y-2 text-[10px] leading-relaxed text-muted-foreground text-center">
                <p>
                  This consensus node certifies that Ari Gunawan Jatmiko is an active Full Stack Web Developer capable of deploying high-performance applications on-chain and off-chain.
                </p>
              </div>

              {/* Action trigger buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setIsReportOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all text-xs cursor-pointer flex items-center justify-center"
                >
                  Return to Node
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.print()
                    }
                  }}
                  className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
                >
                  <FileText className="h-4 w-4" /> Print Certificate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster richColors position="bottom-left" toastOptions={{ style: { borderRadius: "12px", background: "rgba(10, 13, 22, 0.95)", border: "1px solid var(--pf-line)", color: "white" } }} />
    </main>
  )
}
