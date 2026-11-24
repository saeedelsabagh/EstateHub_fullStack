import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "./api/axios";

export default function ProtectedRoute({ role }) {
  const token = localStorage.getItem("token");
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    api.get("/users/me", { signal: controller.signal })
      .then(({ data }) => {
        setSession({ token, role: data.role });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        if ([401, 403].includes(error.response?.status)) {
          localStorage.removeItem("token");
        }
        setSession({ token, error: true });
      });

    return () => controller.abort();
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;
  if (session?.token !== token) return <p role="status">Checking session…</p>;
  if (session.error) return <p role="alert">Could not verify your session. Reload to try again.</p>;
  if (session.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
