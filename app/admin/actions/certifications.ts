"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function csvToArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function readForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    issuer: String(formData.get("issuer") ?? ""),
    date: String(formData.get("date") ?? ""),
    description: String(formData.get("description") ?? ""),
    credentialId: String(formData.get("credentialId") ?? "") || null,
    credentialUrl: String(formData.get("credentialUrl") ?? "") || null,
    skills: csvToArray(formData.get("skills")),
    color: String(formData.get("color") ?? "from-blue-500/20 via-indigo-500/20 to-blue-600/20"),
    icon: String(formData.get("icon") ?? "Zap"),
    order: Number(formData.get("order") ?? 0),
  }
}

export async function createCertification(formData: FormData) {
  await prisma.certification.create({ data: readForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/certifications")
  redirect("/admin/certifications")
}

export async function updateCertification(id: number, formData: FormData) {
  await prisma.certification.update({ where: { id }, data: readForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/certifications")
  redirect("/admin/certifications")
}

export async function deleteCertification(id: number) {
  await prisma.certification.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin/certifications")
}

interface ImportCertificationInput {
  id?: number
  name: string
  issuer: string
  date: string
  description: string
  credentialId?: string | null
  credentialUrl?: string | null
  skills: unknown
  color?: string
  icon?: string
  order?: number
}

export async function importCertifications(items: ImportCertificationInput[]) {
  const ops = items.map((item) => {
    const data = {
      name: item.name,
      issuer: item.issuer,
      date: item.date,
      description: item.description,
      credentialId: item.credentialId ?? null,
      credentialUrl: item.credentialUrl ?? null,
      skills: (item.skills ?? []) as Prisma.InputJsonValue,
      color: item.color ?? "from-blue-500/20 via-indigo-500/20 to-blue-600/20",
      icon: item.icon ?? "Zap",
      order: item.order ?? 0,
    }

    if (item.id) {
      return prisma.certification.upsert({
        where: { id: item.id },
        update: data,
        create: { id: item.id, ...data },
      })
    }

    return prisma.certification.create({ data })
  })

  await prisma.$transaction(ops)
  revalidatePath("/")
  revalidatePath("/admin/certifications")
}

export async function updateCertificationOrder(ids: number[]) {
  const updates = ids.map((id, index) =>
    prisma.certification.update({
      where: { id },
      data: { order: index },
    })
  )
  await prisma.$transaction(updates)
  revalidatePath("/")
  revalidatePath("/admin/certifications")
}
