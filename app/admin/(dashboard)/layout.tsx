import type { Metadata } from "next"
import Link from "next/link"
import { logout } from "../actions/auth"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile & Contact" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/tech-stack", label: "Tech Stack" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/users", label: "Users" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <nav className="flex flex-wrap gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout}>
            <Button variant="outline" size="sm" type="submit">
              Logout
            </Button>
          </form>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
