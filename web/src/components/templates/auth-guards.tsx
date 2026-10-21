import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LineariMark } from "@/components/atoms/lineari-mark";
import { useMe } from "@/hooks/useAuth";

function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-[#050f0e]" role="status" aria-label="Loading">
      <LineariMark className="size-14 animate-pulse" />
    </div>
  );
}

/** Wrap every page that needs a session. Sends visitors to /login and remembers where they were going. */
export function RequireAuth() {
  const { data: user, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) return <Splash />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

/** Wrap login and signup. Signed-in people go straight to the app. */
export function RedirectIfAuthed() {
  const { data: user, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) return <Splash />;
  if (user) {
    const from = (location.state as { from?: string } | null)?.from ?? "/";
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
}