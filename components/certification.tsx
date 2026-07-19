"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, ExternalLink, Calendar, ShieldCheck, X } from "lucide-react"
import SectionHeader from "./section-header"

type CertificationItem = {
  id: number
  name: string
  issuer: string
  date: string
  description: string
  credentialId: string
  credentialUrl: string
  skills: string[]
  color: string
  icon: string
}

interface CertificationProps {
  certifications: CertificationItem[]
}

export default function Certification({ certifications }: CertificationProps) {
  const [activeCert, setActiveCert] = useState<CertificationItem | null>(null)

  return (
    <section id="certs" className="relative py-16 md:py-24 font-jetbrains">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <SectionHeader command="ls certs/" title="Certifications" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start items-start">
        {certifications.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ y: 14 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: Math.min(idx, 5) * 0.05 }}
            className="p-3.5 rounded-xl border border-white/4 bg-[#161D2F]/20 hover:bg-[#161D2F]/40 hover:border-white/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-2">
              {/* Badge/Issuer & Date */}
              <div className="flex items-center justify-between gap-2 text-[8px] md:text-[9px] text-muted-foreground/80 font-ibm font-medium uppercase tracking-wider">
                <span className="text-[#4F8CFF] font-bold">{cert.issuer}</span>
                <span className="flex items-center gap-1 font-geist"><Calendar className="w-2.5 h-2.5" /> {cert.date}</span>
              </div>

              {/* Certificate Name */}
              <h3 className="text-xs font-bold font-departure text-white leading-normal tracking-wide line-clamp-2">
                {cert.name}
              </h3>

              <span className="inline-block text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-muted-foreground/80 font-mono tracking-wider">
                ID: {cert.credentialId || "N/A"}
              </span>
            </div>

            {/* Actions row */}
            <div className="flex gap-2 pt-3 border-t border-white/4 mt-3">
              <button
                onClick={() => setActiveCert(cert)}
                className="flex-1 py-1.5 bg-[#4F8CFF]/10 hover:bg-[#4F8CFF] hover:text-white border border-[#4F8CFF]/20 text-[#4F8CFF] text-[9px] font-departure font-bold rounded transition-all active:scale-95 text-center block"
              >
                Preview
              </button>
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 bg-[#161D2F] hover:bg-white/4 border border-white/6 text-white text-[9px] font-departure font-bold rounded transition-all active:scale-95 text-center flex items-center justify-center gap-1"
              >
                Verify
                <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
              </a>
            </div>
          </motion.div>
        ))}
        </div>
      </div>

      {/* Retro Digital Certificate Lightbox Modal Overlay */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-60 flex items-center justify-center p-4 font-jetbrains"
            onClick={() => setActiveCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#121826] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-6 md:p-10 text-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveCert(null)}
                className="absolute top-3.5 right-3.5 z-10 p-1 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Styled Certificate layout */}
              <div className="border-2 border-dashed border-[#4F8CFF]/30 p-6 md:p-8 rounded-lg relative bg-[#161D2F]/20 space-y-6">
                
                {/* Certificate details heading */}
                <div className="flex flex-col items-center space-y-1">
                  <ShieldCheck className="w-10 h-10 text-[#4F8CFF]" />
                  <span className="text-[10px] text-muted-foreground/60 tracking-widest font-ibm uppercase pt-2">
                    Verification Certificate
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-muted-foreground font-ibm font-medium uppercase tracking-wide block">
                    This certifies that
                  </span>
                  <h3 className="text-lg md:text-xl font-bold font-departure text-white tracking-wide">
                    Ari Gunawan
                  </h3>
                  <span className="text-[9px] text-muted-foreground font-ibm font-medium uppercase tracking-wide block">
                    has successfully achieved the designation
                  </span>
                  <h2 className="text-sm md:text-base font-bold font-departure text-[#4F8CFF] leading-snug tracking-wide">
                    {activeCert.name}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/6 pt-5 text-[10px] text-left text-muted-foreground">
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground/40 font-ibm uppercase tracking-wider text-[8px]">ISSUER</span>
                    <p className="font-bold text-white font-departure">{activeCert.issuer}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground/40 font-ibm uppercase tracking-wider text-[8px]">CREDENTIAL ID</span>
                    <p className="font-bold text-white font-geist text-[9px]">{activeCert.credentialId || "N/A"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground/40 font-ibm uppercase tracking-wider text-[8px]">DATE ACHIEVED</span>
                    <p className="font-bold text-white font-geist">{activeCert.date}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground/40 font-ibm uppercase tracking-wider text-[8px]">STATUS</span>
                    <p className="font-bold text-[#22C55E] font-departure">● VERIFIED</p>
                  </div>
                </div>

                {/* Stamp visual decoration */}
                <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full border border-dashed border-[#8B5CF6]/30 flex items-center justify-center text-[7px] text-[#8B5CF6] font-departure rotate-15">
                  AG CERTIFIED
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center pt-6">
                <a
                  href={activeCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white text-xs font-departure font-bold rounded transition-all active:scale-95 shadow-md shadow-[#4F8CFF]/15"
                >
                  <ExternalLink className="w-4 h-4" />
                  Verify on Authority Site
                </a>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}