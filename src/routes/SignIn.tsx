import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/libConfig";

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
            setTimeout(
              () =>
                supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: "/stats",
                    queryParams: { prompt: "select_account" },
                  },
                }),
              2000
            );
          }}
          style={{ backgroundColor: "skyblue", color: "white" }}
        >
          Sign in with Google
        </button>
      </>
    );
  }
}
