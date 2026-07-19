"use client"

import { motion } from "framer-motion"

export default function SectionHeader({
  command,
  title,
  description,
}: {
  command: string
  title: string
  description?: string
}) {
  return (
    <motion.div
      initial={{ y: 12 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45 }}
      className="max-w-2xl mb-10 md:mb-12"
    >
      <div className="flex items-center gap-2 text-xs font-departure text-white/40 mb-3">
        <span className="text-[#22C55E]">$</span>
        <span>{command}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-departure font-black text-white tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-xl text-pretty">
          {description}
        </p>
      )}
    </motion.div>
  )
}
