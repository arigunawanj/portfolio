"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { AboutCategory } from "@prisma/client"

export async function createTrait(category: AboutCategory, formData: FormData) {
  await prisma.aboutTrait.create({
    data: {
      category,
      icon: String(formData.get("icon") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      order: Number(formData.get("order") ?? 0),
    },
  })
  revalidatePath("/")
  revalidatePath("/admin/about")
}

export async function updateTrait(id: number, formData: FormData) {
  await prisma.aboutTrait.update({
    where: { id },
    data: {
      icon: String(formData.get("icon") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      order: Number(formData.get("order") ?? 0),
    },
  })
  revalidatePath("/")
  revalidatePath("/admin/about")
}

export async function deleteTrait(id: number) {
  await prisma.aboutTrait.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin/about")
}

export async function createFunFact(formData: FormData) {
  await prisma.funFact.create({
    data: {
      text: String(formData.get("text") ?? ""),
      order: Number(formData.get("order") ?? 0),
    },
  })
  revalidatePath("/")
  revalidatePath("/admin/about")
}

export async function updateFunFact(id: number, formData: FormData) {
  await prisma.funFact.update({
    where: { id },
    data: {
      text: String(formData.get("text") ?? ""),
      order: Number(formData.get("order") ?? 0),
    },
  })
  revalidatePath("/")
  revalidatePath("/admin/about")
}

export async function deleteFunFact(id: number) {
  await prisma.funFact.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin/about")
}
