import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCompletion } from "@/components/auth/ProfileCompletion";
import { Session } from "@supabase/supabase-js";

export default function Login() {
  const navigate = useNavigate();
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, school')
          .eq('id', session.user.id)
          .single();

        if (profile?.full_name && profile?.school) {
          navigate('/');
        } else {
          setShowProfileCompletion(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (showProfileCompletion) {
    return <ProfileCompletion />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-sage-300 rounded-full flex items-center justify-center">
            <img src="/Images/OLELogga.png" alt="OLE Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm text-gray-600">Oss Lärare Emellan</span>
        </button>
      </div>

      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">Välkommen tillbaka!</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          localization={{
            variables: {
              sign_in: {
                email_label: "E-postadress",
                password_label: "Lösenord",
                button_label: "Logga in",
              },
              sign_up: {
                email_label: "E-postadress",
                password_label: "Lösenord",
                button_label: "Registrera",
              },
            },
          }}
        />
      </div>
    </div>
  );
}