'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/sellers', label: 'Sellers', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: BarChart2 },
  { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [expanded, setExpanded] = useState(false)

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        'flex flex-col h-screen sticky top-0 bg-card border-r border-border shrink-0 overflow-hidden transition-all duration-200',
        expanded ? 'w-56' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <Link href="/" title="Go to storefront">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-lg shrink-0">
            Q
          </span>
        </Link>
        {expanded && (
          <span className="ml-3 text-base font-bold text-primary whitespace-nowrap">
            Admin Panel
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive({ href, exact })
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Icon size={18} className="shrink-0" />
            {expanded && <span className="whitespace-nowrap">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-border p-3 space-y-2">
        {expanded && session?.user && (
          <div className="px-2 py-1">
            <p className="text-xs font-semibold text-foreground truncate">{session.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors',
            !expanded && 'justify-center'
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {expanded && <span className="whitespace-nowrap">Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
