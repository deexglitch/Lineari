import { Outlet } from "react-router-dom";
import { TopNav } from "@/components/organisms/top-nav";
import { AppBackground } from "../atoms/background";

export function AppLayout() {
  return (
    <div className="relative min-h-dvh text-white">
        <AppBackground />
        <div className="relative z-10" >
            <TopNav />
            <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-6" >
                <Outlet />
            </main>
        </div>
    </div>
  );
}