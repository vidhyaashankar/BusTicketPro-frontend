/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import BookTicket from "./pages/BookTicket";
import ManageTickets from "./pages/ManageTickets";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navbar, MobileNav } from "./components/Navigation";
import { authService } from "./services/authService";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.me();
      setAuthenticated(!!user);
      setLoading(false);
    };
    checkAuth();
    
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  if (loading) return null;
  return authenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await authService.me();
      setUser(data);
    };
    fetchUser();
    window.addEventListener("auth-change", fetchUser);
    return () => window.removeEventListener("auth-change", fetchUser);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
        {user && (
          <>
            <Navbar />
            <MobileNav />
          </>
        )}
        <main className={user ? "md:ml-64 p-4 md:p-8 pb-24 md:pb-8" : ""}>
          <div className={user ? "max-w-6xl mx-auto" : ""}>
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/book" element={
                <ProtectedRoute>
                  <BookTicket />
                </ProtectedRoute>
              } />
              <Route path="/manage" element={
                <ProtectedRoute>
                  <ManageTickets />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
