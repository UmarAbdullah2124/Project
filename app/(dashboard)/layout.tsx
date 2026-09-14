import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { ApolloWrapper } from '@/lib/apollo-wrapper'
import { SidebarNav } from '@/components/custom/sidebar-nav'
import { SidebarUserFooter } from '@/components/custom/sidebar-user-footer'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <ApolloWrapper>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
          <div className="p-6 font-semibold text-lg border-b border-slate-800">
            Client Ops Console
          </div>
          <SidebarNav />
          <SidebarUserFooter name={session.user.name ?? session.user.email ?? 'User'} role={session.user.role} />
        </aside>
        <main className="flex-1 bg-gray-50 p-8 dark:bg-slate-950">{children}</main>
      </div>
    </ApolloWrapper>
  )
}
