"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  Briefcase,
  History,
  GraduationCap,
  Award,
  Layers,
  Info,
  Users,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile & Contact", icon: User },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/experience", label: "Experience", icon: History },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/tech-stack", label: "Tech Stack", icon: Layers },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/users", label: "Users", icon: Users },
]

interface AdminSidebarProps {
  profileName?: string
  profileRole?: string
  logoUrl?: string | null
  logoutAction: () => Promise<void>
}

export default function AdminSidebar({
  profileName = "Administrator",
  profileRole = "CMS Manager",
  logoUrl,
  logoutAction
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-sm text-gradient uppercase tracking-wider">Antigravity CMS</h2>
          <p className="text-[10px] text-muted-foreground font-medium">Control Center</p>
        </div>
      </div>

      {/* Admin Profile Summary */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary">
          {profileName.split(" ").map(n => n[0]).slice(0, 2).join("")}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-semibold text-xs text-foreground truncate">{profileName}</h4>
          <p className="text-[10px] text-muted-foreground truncate">{profileRole}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-admin-nav"
                  className="absolute inset-0 bg-primary/10 border-l-2 border-primary rounded-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={cn("h-4 w-4 relative z-10 transition-colors group-hover:scale-105", isActive && "text-primary")} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-border/50 space-y-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground rounded-lg"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 text-yellow-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>
        <form action={logoutAction}>
          <Button
            variant="ghost"
            size="sm"
            type="submit"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Left side fixed) */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 glass border-r border-white/10 dark:border-white/5 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header Bar */}
      <header className="lg:hidden fixed top-0 w-full h-16 glass border-b border-white/10 dark:border-white/5 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm text-gradient">Antigravity CMS</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-lg"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-background border-r border-border z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
