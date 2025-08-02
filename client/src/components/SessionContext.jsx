import React, { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [session, setSession] = useState({
    loading: true,
    loggedIn: false,
    userId: null,
    displayName: null,
    username: null,
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        setSession({ loading: false, ...data });
      } catch (error) {
        console.error("Failed to fetch session", error);
        setSession({ loading: false, loggedIn: false });
      }
    };

    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
