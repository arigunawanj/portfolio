import { prisma } from "@/lib/prisma"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutCategory } from "@prisma/client"
import {
  createFunFact,
  createTrait,
  deleteFunFact,
  deleteTrait,
  updateFunFact,
  updateTrait,
} from "../../actions/about"

export default async function AboutAdminPage() {
  const [professional, personal, funFacts] = await Promise.all([
    prisma.aboutTrait.findMany({ where: { category: AboutCategory.PROFESSIONAL }, orderBy: { order: "asc" } }),
    prisma.aboutTrait.findMany({ where: { category: AboutCategory.PERSONAL }, orderBy: { order: "asc" } }),
    prisma.funFact.findMany({ orderBy: { order: "asc" } }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">About</h1>

      <TraitSection title="Professional Skills" category={AboutCategory.PROFESSIONAL} traits={professional} />
      <TraitSection title="Personal Traits" category={AboutCategory.PERSONAL} traits={personal} />

      <Card>
        <CardHeader>
          <CardTitle>Fun Facts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {funFacts.map((f) => (
            <form
              key={f.id}
              action={async (formData: FormData) => {
                "use server"
                await updateFunFact(f.id, formData)
              }}
              className="flex items-center gap-2"
            >
              <Input name="text" defaultValue={f.text} className="flex-1" />
              <Input name="order" type="number" defaultValue={f.order} className="w-20" />
              <Button type="submit" size="sm" variant="outline">
                Save
              </Button>
              <Button
                formAction={async () => {
                  "use server"
                  await deleteFunFact(f.id)
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
              await createFunFact(formData)
            }}
            className="flex items-center gap-2 pt-2 border-t"
          >
            <Input name="text" placeholder="New fun fact" className="flex-1" required />
            <Input name="order" type="number" placeholder="Order" className="w-20" defaultValue={funFacts.length} />
            <Button type="submit" size="sm">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function TraitSection({
  title,
  category,
  traits,
}: {
  title: string
  category: AboutCategory
  traits: { id: number; icon: string; title: string; description: string; order: number }[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {traits.map((t) => (
          <form
            key={t.id}
            action={async (formData: FormData) => {
              "use server"
              await updateTrait(t.id, formData)
            }}
            className="grid grid-cols-12 gap-2 items-start border-b pb-4"
          >
            <Input name="icon" defaultValue={t.icon} placeholder="Icon" className="col-span-2" />
            <Input name="title" defaultValue={t.title} placeholder="Title" className="col-span-3" />
            <Textarea name="description" defaultValue={t.description} placeholder="Description" className="col-span-5" />
            <Input name="order" type="number" defaultValue={t.order} className="col-span-1" />
            <div className="col-span-1 flex flex-col gap-1">
              <Button type="submit" size="sm" variant="outline">
                Save
              </Button>
              <Button
                formAction={async () => {
                  "use server"
                  await deleteTrait(t.id)
                }}
                size="sm"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </form>
        ))}
        <form
          action={async (formData: FormData) => {
            "use server"
            await createTrait(category, formData)
          }}
          className="grid grid-cols-12 gap-2 items-start pt-2"
        >
          <Input name="icon" placeholder="Icon" className="col-span-2" required />
          <Input name="title" placeholder="Title" className="col-span-3" required />
          <Textarea name="description" placeholder="Description" className="col-span-5" required />
          <Input name="order" type="number" placeholder="Order" className="col-span-1" defaultValue={traits.length} />
          <Button type="submit" size="sm" className="col-span-1">
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
