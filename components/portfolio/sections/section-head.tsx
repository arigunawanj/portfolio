"use client"

export function SectionHead({ index, tag, title }: { index: string; tag: string; title: string }) {
  return (
    <div className="mb-12 pf-parallax-header">
      <div className="flex items-center gap-3 mb-3">
        <span className="pf-label" style={{ color: "var(--pf-coral)" }}>{index}</span>
        <span className="h-px flex-1 max-w-[80px]" style={{ background: "var(--pf-line)" }} />
        <span className="pf-label">{tag}</span>
      </div>
      <h2 className="font-heading text-5xl md:text-6xl font-bold tracking-tight" style={{ color: "var(--pf-cream)" }}>{title}</h2>
    </div>
  )
}
