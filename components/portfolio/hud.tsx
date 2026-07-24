"use client"

export function Hud({ active, scenes }: { active: string; scenes: string[] }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-4">
      {scenes.map((s) => (
        <a key={s} href={`#${s}-scene`} className="group flex items-center gap-2 justify-end">
          <span className="text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition" style={{ color: "var(--pf-sand)" }}>{s}</span>
          <span className="w-2.5 h-2.5 rounded-full transition" style={{ background: active === s ? "var(--pf-coral)" : "color-mix(in srgb, var(--pf-muted-fg) 50%, transparent)", transform: active === s ? "scale(1.4)" : "scale(1)" }} />
        </a>
      ))}
    </div>
  )
}
