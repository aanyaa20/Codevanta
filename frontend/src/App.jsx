import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import { getAuthIntent, getRedirectForIntent } from "./lib/authIntent";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import SettingsPage from "./pages/SettingsPage";
import LiveSessionsPage from "./pages/LiveSessionsPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  // Handle post-auth redirect based on intent
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const intent = getAuthIntent();
      if (intent) {
        const redirectPath = getRedirectForIntent(intent);
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isLoaded, isSignedIn, navigate]);

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        {/* Landing page - accessible to both authenticated and unauthenticated users */}
        <Route path="/" element={<HomePage />} />
        
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:slug" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
        
        <Route path="/settings" element={isSignedIn ? <SettingsPage /> : <Navigate to={"/"} />} />
        <Route path="/sessions/active" element={isSignedIn ? <LiveSessionsPage /> : <Navigate to={"/"} />} />
        <Route path="/sessions/history" element={isSignedIn ? <HistoryPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;