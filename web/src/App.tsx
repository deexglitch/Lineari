import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/templates/app-layout'
import { RedirectIfAuthed, RequireAuth } from '@/components/templates/auth-guards'
import LoginPage from '@/pages/login-page'
import SignupPage from '@/pages/signup-page'
import OverviewPage from '@/pages/overview-page'
import OrganisationPage from '@/pages/organisation-page'
import { useEmployees } from '@/hooks/useEmployees'
import { useHierarchy } from '@/hooks/useHierarchy'
import { useMe } from '@/hooks/useAuth'
import TermsPage from "@/pages/terms-page";

function OverviewRoute() {
  const { data: employees, isLoading } = useEmployees();
  const { data: me } = useMe();
  const { data: hierarchy } = useHierarchy();

  return (
    <OverviewPage
      isLoading={isLoading}
      employees={employees?.map((e) => ({ id: e.id, managerId: e.manager_id }))}
      user={
        me
          ? {
              name: `${me.first_name} ${me.last_name}`.trim() || me.email,
              email: me.email,
              role: "Lineari account",
            }
          : null
      }
      hierarchy={hierarchy}
    />
  );
}

function OrganisationRoute() {
  const { data, isLoading, isError } = useHierarchy()
  return <OrganisationPage roots={data} isLoading={isLoading} isError={isError} />
}

export default function App() {
  return (
    <Routes>
      <Route path="terms" element={<TermsPage />} />
      <Route element={<RedirectIfAuthed />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<OverviewRoute />} />
          <Route path="organisation" element={<OrganisationRoute />} />

          {/* Keeps any old /table links working */}
          <Route path="table" element={<Navigate to="/employees" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}