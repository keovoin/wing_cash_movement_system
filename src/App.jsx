import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import Login from "./pages/Login";
import { supabase } from "./supabaseClient";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes in authentication state (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!session) {
    return <Login />;
  }

  // Pass the user from the session to the routes
  return <Routes user={session.user} />;
}

export default App;
