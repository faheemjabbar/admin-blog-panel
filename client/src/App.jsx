// src/App.jsx
import React, { useContext, useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./features/calendar/CalendarView";
import SEOtools from "./features/seo/SEOtools";
import Lifecycle from "./features/lifecycle/Lifecycle";
import LoginPage from "./pages/LoginPage";
import UIPrinciples from './features/ui/UIPrinciples';
import { AuthContext } from "./context/AuthContext";
import { Loader } from "lucide-react";

export default function App() {
  const { user, logout, loadingAuth } = useContext(AuthContext); // Get logout from AuthContext
  const [view, setView] = useState("content");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-300">
        <Loader size={48} className="animate-spin text-brand-light dark:text-brand-dark" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage toggleTheme={() => setDarkMode(!darkMode)} darkMode={darkMode} />;
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <MainLayout
        onNavSelect={setView}
        activeView={view}
        toggleTheme={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        user={user} // Pass user and logout as props
        logout={logout}
      >
        {view === "content" && <Dashboard />}
        {view === "calendar" && <CalendarView />}
        {view === "seo" && <SEOtools />}
        {view === "lifecycle" && <Lifecycle />}
        {view === "ui" && <UIPrinciples />}
      </MainLayout>
    </div>
  );
}