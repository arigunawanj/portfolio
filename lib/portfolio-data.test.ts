import { describe, it, expect } from "vitest"
import { mapPortfolioData } from "./portfolio-data"

describe("mapPortfolioData", () => {
  it("casts JSON fields to arrays and applies link fallbacks", () => {
    const out = mapPortfolioData({
      profile: null,
      projects: [{
        id: 1, title: "P", shortDescription: "s", description: "d",
        fullDescription: "f", images: ["a.jpg"], tags: ["ts"], features: ["x"],
        demoLink: null, githubLink: null, color: "c",
      }],
      techCategories: [{ key: "fe", icon: "i", title: "FE", description: "d",
        skills: [{ name: "React", level: 90 }] }],
      experiences: [], education: [], certifications: [], aboutTraits: [], funFacts: [],
    } as any)

    expect(out.projects[0].images).toEqual(["a.jpg"])
    expect(out.projects[0].demoLink).toBe("#")
    expect(out.tech[0].skills[0].name).toBe("React")
    expect(out.contact.email).toBe("")
  })
})
