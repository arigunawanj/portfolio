import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  createSkill,
  deleteCategory,
  deleteSkill,
  updateSkill,
} from "../../actions/tech-stack"

export default async function TechStackAdminPage() {
  const categories = await prisma.techCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tech Stack</h1>
        <Button asChild>
          <Link href="/admin/tech-stack/new">New Category</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {cat.title} <span className="text-muted-foreground text-sm font-normal">({cat.key})</span>
              </CardTitle>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/tech-stack/${cat.id}`}>Edit Category</Link>
                </Button>
                <form
                  action={async () => {
                    "use server"
                    await deleteCategory(cat.id)
                  }}
                >
                  <Button variant="destructive" size="sm" type="submit">
                    Delete Category
                  </Button>
                </form>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {cat.skills.map((skill) => (
                <form
                  key={skill.id}
                  action={async (formData: FormData) => {
                    "use server"
                    await updateSkill(skill.id, formData)
                  }}
                  className="flex items-center gap-2"
                >
                  <Input name="name" defaultValue={skill.name} className="w-48" />
                  <Input name="level" type="number" defaultValue={skill.level} className="w-20" />
                  <Input name="order" type="number" defaultValue={skill.order} className="w-20" />
                  <Button type="submit" size="sm" variant="outline">
                    Save
                  </Button>
                  <Button
                    formAction={async () => {
                      "use server"
                      await deleteSkill(skill.id)
                    }}
                    size="sm"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </form>
              ))}

              <form
                action={async (formData: FormData) => {
                  "use server"
                  await createSkill(cat.id, formData)
                }}
                className="flex items-center gap-2 pt-2 border-t"
              >
                <Input name="name" placeholder="New skill name" className="w-48" required />
                <Input name="level" type="number" placeholder="Level" className="w-20" defaultValue={80} />
                <Input name="order" type="number" placeholder="Order" className="w-20" defaultValue={cat.skills.length} />
                <Button type="submit" size="sm">
                  Add Skill
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
