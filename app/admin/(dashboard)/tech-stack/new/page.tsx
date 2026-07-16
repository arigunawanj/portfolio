import { CategoryForm } from "../category-form"
import { createCategory } from "../../../actions/tech-stack"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Tech Category</h1>
      <CategoryForm action={createCategory} />
    </div>
  )
}
