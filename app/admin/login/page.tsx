"use client"

import { useActionState } from "react"
import { login } from "../actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Lock, User, Terminal, Sparkles } from "lucide-react"

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#080b11] px-4 overflow-hidden font-mono-pf">
      {/* Background blueprint grids & faint vector glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
      <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-60 z-0" />

      {/* Floating Animated Web3 Nodes */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-primary/5 blur-[90px]"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "15%" }}
      />
      <motion.div
        className="absolute w-56 h-56 rounded-full bg-teal-500/5 blur-[80px]"
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 30, -40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "15%", right: "20%" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-sm z-10"
      >
        <Card className="shadow-2xl relative overflow-hidden border border-white/10 bg-black/60 backdrop-blur-xl rounded-2xl">
          {/* Top glowing neon consensus line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-primary to-transparent" />
          
          <CardHeader className="space-y-2 text-center pt-8">
            <div className="mx-auto w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-1">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex items-center justify-center gap-1.5 font-bold text-[9px] tracking-widest text-primary uppercase select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>status: auth_standby</span>
            </div>

            <CardTitle className="text-xl font-bold tracking-tight text-white uppercase mt-1">CMS Cockpit</CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Consensus credentials handshake signature required
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            <form action={formAction} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Validator User
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                  <Input 
                    id="username" 
                    name="username" 
                    required 
                    autoComplete="username" 
                    placeholder="ENTER_USERNAME" 
                    className="pl-10 h-10 bg-slate-950/40 focus-visible:ring-primary/45 border-white/5 text-xs text-white rounded-xl placeholder-white/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Handshake Secret
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    autoComplete="current-password" 
                    placeholder="••••••••••••"
                    className="pl-10 h-10 bg-slate-950/40 focus-visible:ring-primary/45 border-white/5 text-xs text-white rounded-xl placeholder-white/15"
                  />
                </div>
              </div>

              {state?.error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5 text-center uppercase tracking-wider"
                >
                  {state.error}
                </motion.p>
              )}

              <Button 
                type="submit" 
                className="w-full mt-3 h-10 bg-linear-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-white font-bold tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl active:scale-[0.98] cursor-pointer" 
                disabled={pending}
              >
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SIGNING_TX...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> INITIATE_HANDSHAKE
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
