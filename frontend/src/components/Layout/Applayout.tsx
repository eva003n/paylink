import { ArrowLeftRight, LayoutDashboard, Link2, LogOut, Menu, Settings, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "../../utils";
import Logo from "../shared/Logo";
import { Button } from "../ui";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/links", icon: Link2, label: "Payment Links" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/settings", icon: Settings, label: "API Settings" },
];

 const Applayout = () => {
  const { user, logOut, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
       await logOut();
       toast.success("Logged out successfully");
       navigate("/sign-in");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

    const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-stone-100">
        <Logo color="text-brand-600"/>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-stone-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors group cursor-pointer mb-1">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-brand-700">
              {user?.businessName.toUpperCase().charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-stone-900 truncate">{user?.businessName}</p>
            {/* <p className="text-xs text-stone-400 truncate">{user?.email || "email"}</p> */}
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="flex bg-brand-500 items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
        loading={loading}
        icon={LogOut}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-stone-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="animate-fade-in relative flex w-64 flex-col bg-white shadow-2xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-1.5 hover:bg-stone-100"
            >
              <X className="h-4 w-4 text-stone-500" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
          <Logo />
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-stone-100"
          >
            <Menu className="h-5 w-5 text-stone-600" />
          </button>
        </div>

        {/* Scrollable page area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      
    </div>
  );
};

export default Applayout;
