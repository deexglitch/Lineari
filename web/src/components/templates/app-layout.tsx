import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/organisms/app-header'

// The page frame: header on top, the current page below.
export function AppLayout() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl p-8">
        <Outlet />
      </main>
    </div>
  )
}