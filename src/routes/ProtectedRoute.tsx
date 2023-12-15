import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/libConfig";
import { Session } from "@supabase/supabase-js";

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState<Session | null>(
    supabase.auth.getSession()
  );
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {};
  }, []);

  useEffect(() => {
    if (!session) {
      navigate("/signin");
    }
  }, [session]);

  return <>{children}</>;
}
