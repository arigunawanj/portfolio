"use client"

export function Slide({
  id,
  mode,
  children,
}: {
  id: string
  mode: "deck" | "scroll"
  children: React.ReactNode
}) {
  if (mode === "deck") {
    return (
      <section
        id={id}
        className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 w-full h-full overflow-y-auto overscroll-contain flex items-center justify-center px-5 md:px-10 py-20 pr-5 md:pr-24">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </div>
      </section>
    )
  }

  return (
    <section id={id} className="relative w-full snap-start scroll-mt-16">
      {children}
    </section>
  )
}
