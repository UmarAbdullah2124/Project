'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-provider'

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}

export function SidebarUserFooter({
  name,
  role,
}: {
  name: string
  role: string
}) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div className="p-4 border-t border-slate-800 flex items-center gap-3">
      <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1 text-sm">
        <div className="truncate font-medium text-white">{name}</div>
        <div className="text-slate-400 text-xs">{formatRole(role)}</div>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        title="Toggle theme"
      >
        {mounted && theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        title="Sign out"
      >
        <LogOut size={16} />
      </button>
    </div>
  )
}
