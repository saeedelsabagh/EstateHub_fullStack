import { useEffect, useState } from "react";
import api from "./axios";

export default function useCurrentUser() {
  const token = localStorage.getItem("token");
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    api.get("/users/me", { signal: controller.signal })
      .then(({ data }) => setSession({ token, user: data }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        const expired = [401, 403].includes(error.response?.status);
        setSession({ token, error: expired ? "Please sign in again." : "Could not load your account. Please retry." });
      });

    return () => controller.abort();
  }, [token]);

  if (!token) return { user: null, loading: false, error: "" };
  if (session?.token !== token) return { user: null, loading: true, error: "" };
  return { ...session, loading: false };
}
