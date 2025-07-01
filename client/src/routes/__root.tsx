import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import TopNav from '../components/TopNav';
import SideNav from '../components/SideNav';

export const Route = createRootRoute({
  component: () => (
    <div className="w-screen min-h-screen flex flex-col bg-gray-200">
      <TopNav />
      <div className="flex flex-1 w-full items-stretch">
        <SideNav />
        <main className="flex-1 p-6 bg-white shadow rounded-lg m-6 overflow-y-scroll">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
});
