export type DeckMode = "deck" | "scroll"

export type SlideMeta = {
  index: number
  key: string
  label: string
}

export const SLIDES: SlideMeta[] = [
  { index: 0, key: "home", label: "Home" },
  { index: 1, key: "projects", label: "Projects" },
  { index: 2, key: "skills", label: "Skills" },
  { index: 3, key: "experience", label: "Experience" },
  { index: 4, key: "education", label: "Education" },
  { index: 5, key: "certs", label: "Certifications" },
  { index: 6, key: "contact", label: "Contact" },
]
