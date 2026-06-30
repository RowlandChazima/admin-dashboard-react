import React, { useState } from "react";
import Register from "./components/Register";
import Welcome from "./components/Welcome";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [view, setView] = useState("register"); // 'register' | 'welcome' | 'dashboard'
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleRegistrationSuccess = (user, isAdmin) => {
    setRegisteredUser(user);
    if (isAdmin) {
      setView("dashboard");
    } else {
      setView("welcome");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#2d3748] antialiased">
      {view === "register" && (
        <Register
          onSuccess={handleRegistrationSuccess}
          onViewChange={setView}
        />
      )}
      {view === "welcome" && (
        <Welcome user={registeredUser} onNavigate={() => setView("register")} />
      )}
      {view === "dashboard" && <Dashboard />}
    </div>
  );
}
