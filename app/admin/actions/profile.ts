"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  await prisma.siteProfile.upsert({
    where: { id: 1 },
    update: {
      name: String(formData.get("name") ?? ""),
      role: String(formData.get("role") ?? ""),
      heroBadge: String(formData.get("heroBadge") ?? ""),
      heroDescription: String(formData.get("heroDescription") ?? ""),
      photoUrl: String(formData.get("photoUrl") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      githubUrl: String(formData.get("githubUrl") ?? "") || null,
      linkedinUrl: String(formData.get("linkedinUrl") ?? "") || null,
      instagramUrl: String(formData.get("instagramUrl") ?? "") || null,
      gitlabUrl: String(formData.get("gitlabUrl") ?? "") || null,
      twitterUrl: String(formData.get("twitterUrl") ?? "") || null,
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
    },
    create: {
      id: 1,
      name: String(formData.get("name") ?? ""),
      role: String(formData.get("role") ?? ""),
      heroBadge: String(formData.get("heroBadge") ?? ""),
      heroDescription: String(formData.get("heroDescription") ?? ""),
      photoUrl: String(formData.get("photoUrl") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      githubUrl: String(formData.get("githubUrl") ?? "") || null,
      linkedinUrl: String(formData.get("linkedinUrl") ?? "") || null,
      instagramUrl: String(formData.get("instagramUrl") ?? "") || null,
      gitlabUrl: String(formData.get("gitlabUrl") ?? "") || null,
      twitterUrl: String(formData.get("twitterUrl") ?? "") || null,
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
    },
  })
  revalidatePath("/")
  revalidatePath("/admin/profile")
}
