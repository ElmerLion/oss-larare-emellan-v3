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
    Menu, // For the hamburger button
    CircleHelp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { FeedbackDialog } from "@/components/settings/FeedbackDialog";

const menuItems = [
    { icon: Home, label: "Hem", path: "/home" },
    { icon: User, label: "Profil", path: "/profil" },
    { icon: Users, label: "Forum", path: "/forum" },
    // { icon: MessageSquare, label: "Meddelanden", path: "/meddelanden" },
    { icon: Book, label: "Resurser", path: "/resurser" },
    { icon: Library, label: "Mitt Bibliotek", path: "/mitt-bibliotek" },
    { icon: Settings, label: "Inställningar", path: "/installningar" },
];

interface AppSidebarProps {
    offset?: number;
}

export function AppSidebar({ offset = 0 }: AppSidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [session, setSession] = useState<Session | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
                        if (payload.old.is_read === false && payload.new.is_read === true) {
                            setUnreadCount((prev) => Math.max(prev - 1, 0));
                        }
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

    // Fetch the user's role from the "profiles" table.
    useEffect(() => {
        const fetchUserRole = async () => {
            if (!session?.user) {
                setIsAdmin(false);
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select('"role"')
                .eq("id", session.user.id)
                .single();

            if (error) {
                console.error("Error fetching user role", error);
                setIsAdmin(false);
                return;
            }

            setIsAdmin(data.role === "Admin");
        };

        fetchUserRole();
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
        <>
            {/* Hamburger Button (visible on mobile when sidebar is closed) */}
            {!isSidebarOpen && (
                <div className="lg:hidden fixed top-4 left-4 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white rounded shadow"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Overlay on mobile/tablet when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4 z-40 transform transition-transform duration-300 overflow-y-auto",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0" // Always show sidebar on large screens
                )}
                style={{ top: offset }}
            >
                <div className="flex flex-col">
                    {/* Sidebar Header */}
                    <div className="flex items-center gap-2 group mb-8">
                        <div className="w-10 h-10 bg-sage-300 rounded-full flex items-center justify-center transform transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg">
                            <button
                                onClick={() => {
                                    navigate("/home");
                                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                }}
                                className="flex items-center gap-2"
                            >
                                <img
                                    src="/Images/OLELogga.png"
                                    alt="OLE Logo"
                                    className="w-full h-full object-contain"
                                />
                            </button>
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                            Oss Lärare Emellan
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => {
                                    // Close sidebar on mobile or if already on the current page.
                                    if (
                                        window.innerWidth < 1024 ||
                                        location.pathname === item.path
                                    ) {
                                        setIsSidebarOpen(false);
                                    }
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors",
                                    (item.path === "/profil" &&
                                        location.pathname.startsWith("/profil")) ||
                                        (item.path === "/forum" &&
                                            location.pathname.startsWith("/forum")) ||
                                        location.pathname === item.path
                                        ? "bg-sage-50 text-sage-500"
                                        : ""
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

                        {isAdmin && (
                            <div className="hidden sm:block">
                                <div className="px-4 py-2 mt-4 text-gray-500 uppercase text-xs">
                                    Admin
                                </div>
                                <Link
                                    to="/admin/oversikt"
                                    onClick={() => {
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors",
                                        location.pathname === "/admin/oversikt" &&
                                        "bg-sage-50 text-sage-500"
                                    )}
                                >
                                    <span>Översikt</span>
                                </Link>
                                <Link
                                    to="/admin/skapa"
                                    onClick={() => {
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors",
                                        location.pathname === "/admin/skapa" &&
                                        "bg-sage-50 text-sage-500"
                                    )}
                                >
                                    <span>Skapa/Ändra</span>
                                </Link>
                                <Link
                                    to="/admin/feedback"
                                    onClick={() => {
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors",
                                        location.pathname === "/admin/feedback" &&
                                        "bg-sage-50 text-sage-500"
                                    )}
                                >
                                    <span>Feedback</span>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Feedback Button placed above the authentication section */}
                    <FeedbackDialog
                        triggerElement={
                            <button
                                onClick={() => {
                                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                }}
                                className="mt-16 flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors w-full"
                            >
                                <CircleHelp className="w-5 h-5" />
                                <span>Skicka Feedback</span>
                            </button>
                        }
                    />

                    {/* Logout / Authentication Section */}
                    <div className="space-y-2">
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
                                    onClick={() => {
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors w-full"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Logga in</span>
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => {
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-sage-50 transition-colors w-full"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    <span>Registrera</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
