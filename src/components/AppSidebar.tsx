import {
  Home,
  User,
  Users,
  Book,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Library,
  MessageSquare,
} from "lucide-react"; // Added MessageSquare for Diskussioner
import { cn } from "@/lib/utils";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

const menuItems = [
  { icon: Home, label: "Hem", path: "/" },
  { icon: User, label: "Profil", path: "/profil" },
  { icon: MessageSquare, label: "Forum", path: "/forum" },
  { icon: Users, label: "Meddelanden", path: "/meddelanden" },
  { icon: Book, label: "Resurser", path: "/resurser" },
  { icon: Library, label: "Mitt Bibliotek", path: "/mitt-bibliotek" },
  { icon: Settings, label: "Inställningar", path: "/installningar" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Listen for authentication changes.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch unread messages count and subscribe to changes.
  useEffect(() => {
    if (!session?.user) {
      setUnreadCount(0);
      return;
    }
    const userId = session.user.id;

    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", userId)
        .eq("is_read", false);
      if (error) {
        console.error("Error fetching unread count:", error);
      } else {
        setUnreadCount(count ?? 0);
      }
    };

    fetchUnreadCount();

    // Subscribe to changes in the messages table.
    const channel = supabase
      .channel("unread-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (
            payload.new.receiver_id === userId &&
            payload.new.is_read === false
          ) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.receiver_id === userId) {
            // When a message changes from unread to read, decrease count.
            if (payload.old.is_read === false && payload.new.is_read === true) {
              setUnreadCount((prev) => Math.max(prev - 1, 0));
            }
            // Optionally, if a message is marked unread again, increase the count.
            if (payload.old.is_read === true && payload.new.is_read === false) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("supabase.auth.token");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error("Ett fel uppstod vid utloggning");
        return;
      }
      setSession(null);
      navigate("/login");
      toast.success("Du har loggats ut");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ett fel uppstod vid utloggning");
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 group mb-8">
        <div className="w-10 h-10 bg-sage-300 rounded-full flex items-center justify-center transform transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
          <button onClick={() => navigate("/home")} className="flex items-center gap-2">
            <img src="/Images/OLELogga.png" alt="OLE Logo" className="w-full h-full object-contain" />
          </button>
        </div>
        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
          Oss Lärare Emellan
        </span>
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
            {item.label === "Meddelanden" && unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 left-4 right-4 space-y-2">
        {session ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logga ut</span>
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors w-full"
            >
              <LogIn className="w-5 h-5" />
              <span>Logga in</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors w-full"
            >
              <UserPlus className="w-5 h-5" />
              <span>Registrera</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
