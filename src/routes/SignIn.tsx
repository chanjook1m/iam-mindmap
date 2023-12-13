import { useState, useEffect } from "react";
import { Session, createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useLocation } from "react-router-dom";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function SignIn() {
  const [session, setSession] = useState<Session | null>(null);

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

  if (!session) {
    return (
      <>
        <button
          onClick={() => {
            supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: "http://localhost:5173/daynote/3",
                queryParams: { prompt: "select_account" },
              },
            });
          }}
          style={{ backgroundColor: "skyblue", color: "white" }}
        >
          Sign in with Google
        </button>
      </>
    );
  } else {
    return (
      <>
        <button
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          Log out
        </button>

        <div>Logged in!</div>
      </>
    );
  }
}
