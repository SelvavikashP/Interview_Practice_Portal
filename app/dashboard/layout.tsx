import { ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import { LayoutDashboard, FileText, PlayCircle, History, User } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume & Setup', href: '/dashboard/resume', icon: FileText },
    { name: 'Assessments', href: '/dashboard/assessments', icon: PlayCircle },
    { name: 'Attempt History', href: '/dashboard/history', icon: History },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ]

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-4">
        <div className="font-bold text-xl py-4 border-b">Practice Portal</div>
        <nav className="flex-1 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="border-t pt-4 space-y-4">
          <div className="text-sm px-3 text-zinc-500 truncate" title={user?.email}>
            {user?.email}
          </div>
          <form action={signOut}>
            <Button variant="outline" className="w-full justify-start text-destructive" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  )
}
