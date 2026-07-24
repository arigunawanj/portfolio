"use client"

export function Hud({ active, scenes }: { active: string; scenes: string[] }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3">
      {scenes.map((s, i) => {
        const on = active === s
        return (
          <a
            key={s}
            href={`#${s}-scene`}
            aria-label={`Go to ${s} section`}
            className="pf-focusable cursor-pointer group flex items-center gap-3 justify-end"
          >
            <span className="font-mono-pf text-[10px] tracking-wider uppercase transition opacity-0 group-hover:opacity-100" style={{ color: "var(--pf-sand)" }}>
              {s}
            </span>
            <span className="font-mono-pf text-[10px] w-5 text-right transition" style={{ color: on ? "var(--pf-coral)" : "var(--pf-muted-fg)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="h-px transition-all"
              style={{
                width: on ? 28 : 12,
                background: on ? "var(--pf-coral)" : "color-mix(in srgb, var(--pf-muted-fg) 50%, transparent)",
              }}
            />
          </a>
        )
      })}
    </div>
  )
}
