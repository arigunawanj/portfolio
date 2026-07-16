"use client"

import { useActionState } from "react"
import { login } from "../actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Lock, User, Sparkles } from "lucide-react"

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Background Decorative Mesh / Glows */}
      <div className="absolute inset-0 bg-mesh opacity-40 z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] z-0" />

      {/* Floating Animated Blobs */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px]"
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "15%" }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full bg-purple-500/10 blur-[80px]"
        animate={{
          x: [0, -50, 60, 0],
          y: [0, 40, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "15%", right: "20%" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm z-10"
      >
        <Card className="glass shadow-2xl relative border border-white/10 dark:border-white/5 overflow-hidden">
          {/* Top glow line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <CardHeader className="space-y-1 text-center pt-8">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gradient">CMS Administrator</CardTitle>
            <CardDescription>Enter your credentials to manage your website</CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="username" 
                    name="username" 
                    required 
                    autoComplete="username" 
                    placeholder="Enter username" 
                    className="pl-10 bg-background/50 focus-visible:ring-primary/50 transition-all border-border/60"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    autoComplete="current-password" 
                    placeholder="Enter password"
                    className="pl-10 bg-background/50 focus-visible:ring-primary/50 transition-all border-border/60"
                  />
                </div>
              </div>
              {state?.error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2 text-center"
                >
                  {state.error}
                </motion.p>
              )}
              <Button 
                type="submit" 
                className="w-full mt-2 font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 py-5 rounded-lg active:scale-[0.98]" 
                disabled={pending}
              >
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
