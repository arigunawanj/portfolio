"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Briefcase,
  History,
  GraduationCap,
  Award,
  Layers,
  Info,
  Users,
  ArrowUpRight
} from "lucide-react"

interface CardItem {
  label: string
  count: number
  href: string
  color: string
}

interface DashboardGridProps {
  cards: CardItem[]
}

const ICON_MAP: Record<string, any> = {
  "Projects": Briefcase,
  "Work Experience": History,
  "Education": GraduationCap,
  "Certifications": Award,
  "Tech Stack": Layers,
  "About Traits": Info,
  "Admin Users": Users,
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } },
}

export default function DashboardGrid({ cards }: DashboardGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {cards.map((c) => {
        const IconComponent = ICON_MAP[c.label] || Briefcase
        return (
          <motion.div
            key={c.href}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="h-full"
          >
            <Link href={c.href} className="block h-full group">
              <Card className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 h-full flex flex-col justify-between p-5 select-none">
                {/* Decorative background gradient accent */}
                <div className={`absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-gradient-to-tr ${c.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-xl transition-all duration-300`} />

                <div className="space-y-4">
                  {/* Card Header Info */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {c.label}
                    </span>
                    <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${c.color} bg-opacity-10 border border-primary/10 text-primary transition-all duration-300 group-hover:scale-105`}>
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Card count details */}
                  <div className="space-y-1">
                    <span className="text-4xl font-black tracking-tight text-foreground flex items-baseline">
                      {c.count}
                    </span>
                  </div>
                </div>

                {/* Footer Navigation Trigger */}
                <div className="border-t border-border/30 pt-3.5 mt-5 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-all duration-300">
                  <span className="font-bold">Edit Details</span>
                  <div className="p-1 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
