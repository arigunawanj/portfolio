import type { Metadata } from "next"
import { logout } from "../actions/auth"
import { prisma } from "@/lib/prisma"
import AdminSidebar from "@/components/admin/sidebar"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await prisma.siteProfile.findUnique({ where: { id: 1 } })

  return (
    <div className="min-h-screen bg-background text-foreground bg-mesh opacity-95">
      <AdminSidebar
        profileName={profile?.name || "Administrator"}
        profileRole={profile?.role || "CMS Manager"}
        logoUrl={profile?.logoUrl}
        logoutAction={logout}
      />
      <div className="lg:pl-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
        <main className="flex-1 p-6 md:p-8 w-full">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}
