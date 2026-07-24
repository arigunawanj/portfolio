const DOT_COUNT = 9

export default function ChainDivider() {
  return (
    <div className="relative py-2 select-none" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="relative h-6 flex items-center justify-center gap-6 md:gap-10">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent" />
          {Array.from({ length: DOT_COUNT }).map((_, i) => (
            <span key={i} className="relative w-1.5 h-1.5 rounded-full bg-white/15">
              <span
                className="absolute inset-0 rounded-full bg-chain chain-divider-pulse"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
