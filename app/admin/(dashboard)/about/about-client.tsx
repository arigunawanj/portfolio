"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Heart, Smile, Sparkles } from "lucide-react"
import TraitsListClient from "./traits-list"
import FunFactsListClient from "./fun-facts-list"

interface Trait {
  id: number
  icon: string
  title: string
  description: string
  order: number
}

interface FunFact {
  id: number
  text: string
  order: number
}

interface AboutClientProps {
  professional: Trait[]
  personal: Trait[]
  funFacts: FunFact[]
}

const TABS = [
  { id: "professional", label: "Professional Skills", icon: Briefcase, countKey: "professional" },
  { id: "personal", label: "Personal Traits", icon: Heart, countKey: "personal" },
  { id: "funfacts", label: "Fun Facts", icon: Smile, countKey: "funFacts" },
]

export default function AboutClient({ professional, personal, funFacts }: AboutClientProps) {
  const [activeTab, setActiveTab] = useState("professional")

  const counts = {
    professional: professional.length,
    personal: personal.length,
    funFacts: funFacts.length,
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden dark:bg-black/20 dark:border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-primary pointer-events-none">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="space-y-1 relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">About Settings</h1>
          <p className="text-sm text-muted-foreground">
            Overhaul your public identity profile: core talents, characteristic traits, and fast trivia.
          </p>
        </div>
      </div>

      {/* Tab controls */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/65 border border-border/80 rounded-2xl backdrop-blur-md dark:bg-black/30 dark:border-white/5 max-w-2xl">
        {TABS.map((tab) => {
          const TabIcon = tab.icon
          const isActive = activeTab === tab.id
          const count = counts[tab.countKey as keyof typeof counts]
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-about-settings-tab"
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/15"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              <TabIcon className="h-4 w-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
              <span className={`relative z-10 text-[9px] px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10"
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content panel */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "professional" && (
            <motion.div
              key="professional"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <TraitsListClient title="Professional Skills" category="PROFESSIONAL" initialTraits={professional} />
            </motion.div>
          )}

          {activeTab === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <TraitsListClient title="Personal Traits" category="PERSONAL" initialTraits={personal} />
            </motion.div>
          )}

          {activeTab === "funfacts" && (
            <motion.div
              key="funfacts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <FunFactsListClient initialFunFacts={funFacts} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
