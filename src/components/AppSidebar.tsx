import { Home, User, Users, Book, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Hem", path: "/" },
  { icon: User, label: "Profil", path: "/profil" },
  { icon: Users, label: "Kontakter", path: "/kontakter" },
  { icon: Book, label: "Resurser", path: "/resurser" },
  { icon: Settings, label: "Inställningar", path: "/installningar" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-sage-300 rounded-full flex items-center justify-center text-white font-bold">
          <img src="/Images/OLELogga.png" alt="OLE Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-sm text-gray-600">Oss Lärare Emellan</span>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors",
              location.pathname === item.path && "bg-sage-50 text-sage-500"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 left-4 right-4">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span>Logga ut</span>
        </button>
      </div>
    </div>
  );
}