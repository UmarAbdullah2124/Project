'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FolderKanban, Receipt, Settings } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Invoices', href: '/invoices', icon: Receipt },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
