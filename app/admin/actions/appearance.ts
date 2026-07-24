"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const APPEARANCE_DEFAULTS = {
  id: 1,
  palette: "teal-coral",
  motionLevel: "full",
  enable3D: true,
  accentColor: "#E8785B",
  headingFont: "Space Grotesk",
}

export async function getAppearance() {
  try {
    const row = await prisma.appearance.findUnique({ where: { id: 1 } })
    return row ?? APPEARANCE_DEFAULTS
  } catch {
    return APPEARANCE_DEFAULTS
  }
}

export async function updateAppearance(formData: FormData) {
  const data = {
    palette: String(formData.get("palette") ?? "teal-coral"),
    motionLevel: String(formData.get("motionLevel") ?? "full"),
    enable3D: formData.get("enable3D") === "on" || formData.get("enable3D") === "true",
    accentColor: String(formData.get("accentColor") ?? "#E8785B"),
    headingFont: String(formData.get("headingFont") ?? "Space Grotesk"),
  }
  await prisma.appearance.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  })
  revalidatePath("/")
  revalidatePath("/admin/appearance")
}
