import type { Metadata } from "next"
import Hero from "@/components/hero"
import About from "@/components/about"
import TechStack from "@/components/tech-stack"
import Projects from "@/components/projects"
import WorkExperience from "@/components/work-experience"
import Education from "@/components/education"
import Certification from "@/components/certification"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "Ari Gunawan Jatmiko | Portfolio",
  description: "Professional portfolio of Ari Gunawan Jatmiko - Full Stack Web Developer",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <WorkExperience />
        <Education />
        <Certification />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

