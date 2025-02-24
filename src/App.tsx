// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Kontakter from "./pages/Kontakter";
import Resurser from "./pages/Resurser";
import MittBibliotek from "./pages/MittBibliotek";
import Profil from "./pages/Profil";
import OmOss from "./pages/OmOss";
import IntegritetsPolicy from "./pages/IntegritetsPolicy";
import Diskussioner from "./pages/Diskussioner";
import DiscussionDetail from "@/components/DiscussionDetail";
import Installningar from "./pages/Installningar";
import Funktioner from "./pages/Funktioner";
import Contact from "@/pages/Contact";
import Search from "@/pages/Search";
import InstructionManual from "@/pages/InstructionManual";

// Import Admin Pages
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminModeration } from "@/components/admin/AdminModeration";
import { AdminCreate } from "@/components/admin/AdminCreate";
import { AdminFeedback } from "@/components/admin/AdminFeedback";

const queryClient = new QueryClient();

// A simple component to protect admin routes
const AdminProtected = ({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: JSX.Element;
}) => {
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

const AppRoutes = ({
  isAuthenticated,
  currentUserId,
  isAdmin,
}: {
  isAuthenticated: boolean;
  currentUserId: string | null;
  isAdmin: boolean;
}) => {
  const location = useLocation();
  // Check if the URL has the register query parameter
  const isRegisteringRoute = location.search.includes("register=true");

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated || isRegisteringRoute ? (
            <Login />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Index />}
      />
      <Route
        path="/home"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/meddelanden"
        element={
          isAuthenticated ? <Kontakter /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/resurser"
        element={isAuthenticated ? <Resurser /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/sök"
        element={isAuthenticated ? <Search /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/mitt-bibliotek"
        element={
          isAuthenticated ? <MittBibliotek /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/forum"
        element={
          isAuthenticated ? <Diskussioner /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/forum/:slug"
        element={
          isAuthenticated ? <DiscussionDetail /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/profil/:id"
        element={isAuthenticated ? <Profil /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/profil"
        element={
          isAuthenticated ? (
            <Navigate to={`/profil/${currentUserId}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/omoss" element={<OmOss />} />
      <Route path="/integritetspolicy" element={<IntegritetsPolicy />} />
      <Route path="/kontakt" element={<Contact />} />
      <Route
        path="/installningar"
        element={
          isAuthenticated ? <Installningar /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/instruktionsmanual"
        element={
          isAuthenticated ? <InstructionManual /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/funktioner" element={<Funktioner />} />

      {/* Admin Routes */}
      <Route
        path="/admin/oversikt"
        element={
          isAuthenticated ? (
            <AdminProtected isAdmin={isAdmin}>
              <AdminOverview />
            </AdminProtected>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/moderation"
        element={
          isAuthenticated ? (
            <AdminProtected isAdmin={isAdmin}>
              <AdminModeration />
            </AdminProtected>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/skapa"
        element={
          isAuthenticated ? (
            <AdminProtected isAdmin={isAdmin}>
              <AdminCreate />
            </AdminProtected>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/feedback"
        element={
          isAuthenticated ? (
            <AdminProtected isAdmin={isAdmin}>
              <AdminFeedback />
            </AdminProtected>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />}
      />
    </Routes>
  );
};

const App = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setCurrentUserId(session.user.id);
      } else {
        setIsAuthenticated(false);
        setCurrentUserId(null);
      }
    };

    checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setCurrentUserId(session.user.id);
        } else {
          setIsAuthenticated(false);
          setCurrentUserId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user's role to check if they are Admin
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUserId) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select('"Role"')
        .eq("id", currentUserId)
        .single();

      if (error) {
        console.error("Error fetching user role", error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(data.Role === "Admin");
    };

    fetchUserRole();
  }, [currentUserId]);

  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-[#F6F6F7]">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex-grow">
              <AppRoutes
                isAuthenticated={isAuthenticated}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
              />
            </div>
            <Footer />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
