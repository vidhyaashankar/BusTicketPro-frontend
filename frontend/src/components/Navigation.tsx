import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Ticket as TicketIcon, PlusCircle, Bus, LogOut } from "lucide-react";
import { cn } from "../utils/cn";
import { authService } from "../services/authService";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/book", label: "Book Ticket", icon: PlusCircle },
    { path: "/manage", label: "Manage Tickets", icon: TicketIcon },
  ];

  const handleLogout = () => {
    authService.logout();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 p-6 hidden md:flex flex-col">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Bus className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">BusTicketPro</h1>
      </div>
      
      <div className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-300")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200 mt-auto"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sign Out</span>
      </button>
    </nav>
  );
}

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home", icon: LayoutDashboard },
    { path: "/book", label: "Book", icon: PlusCircle },
    { path: "/manage", label: "Tickets", icon: TicketIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 p-2 flex justify-around md:hidden z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
              isActive ? "text-emerald-500" : "text-zinc-500"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 p-2 rounded-lg text-zinc-500"
      >
        <LogOut className="w-6 h-6" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Exit</span>
      </button>
    </nav>
  );
}
