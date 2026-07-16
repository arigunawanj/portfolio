import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CategoryForm } from "../category-form"
import { updateCategory } from "../../../actions/tech-stack"

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.techCategory.findUnique({ where: { id: Number(id) } })
  if (!item) notFound()

  const boundUpdate = updateCategory.bind(null, item.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Tech Category</h1>
      <CategoryForm item={item} action={boundUpdate} />
    </div>
  )
}
