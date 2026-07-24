import { getAppearance } from "@/app/admin/actions/appearance"
import AppearanceClient from "./appearance-client"

export default async function AppearanceAdminPage() {
  const appearance = await getAppearance()
  return <AppearanceClient initialData={appearance} />
}
