import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Funktioner from  "./pages/Funktioner";


const queryClient = new QueryClient();

const App = () => {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsAuthenticated(true);
      setCurrentUserId(session.user.id); // Always set the current user ID
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null);
    }
  };

  checkSession();

  const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setIsAuthenticated(true);
      setCurrentUserId(session.user.id); // Update user ID on login
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null); // Clear user ID on logout
    }
  });

  return () => subscription.unsubscribe();
}, []);


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
              <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} />
                <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Index />} />
                <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
                <Route path="/meddelanden" element={isAuthenticated ? <Kontakter /> : <Navigate to="/login" replace />} />
                <Route path="/resurser" element={isAuthenticated ? <Resurser /> : <Navigate to="/login" replace />} />
                <Route path="/mitt-bibliotek" element={isAuthenticated ? <MittBibliotek /> : <Navigate to="/login" replace />} />
                <Route path="/profil/:id" element={isAuthenticated ? <Profil /> : <Navigate to="/login" replace />} />
                <Route path="/profil" element={isAuthenticated ? <Navigate to={`/profil/${currentUserId}`} replace /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
                <Route path="/omoss" element={<OmOss />} />
                <Route path="/integritets-policy" element={<IntegritetsPolicy />} />
                <Route path="/forum" element={<Diskussioner />} />
                <Route path="/forum/:slug" element={<DiscussionDetail />} />
                <Route path="/installningar" element={<Installningar />} />
                <Route path="/funktioner" element={<Funktioner />} />
              </Routes>
            </div>
            <Footer />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;