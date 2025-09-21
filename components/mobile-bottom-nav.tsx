"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Home, Users, BarChart3, UserPlus, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const bottomNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    badge: null,
  },
  {
    title: "Candidates",
    href: "/candidates",
    icon: Users,
    badge: "12",
  },
  {
    title: "Add",
    href: "/candidates/add",
    icon: UserPlus,
    badge: null,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Alerts",
    href: "/notifications",
    icon: Bell,
    badge: "3",
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t">
      <nav className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative",
                "min-w-0 flex-1 max-w-[80px]",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground active:text-primary",
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-[10px] flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium truncate w-full text-center">{item.title}</span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
