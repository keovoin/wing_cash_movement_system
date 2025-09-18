import React, { useState } from "react";
import Routes from "./Routes";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd have actual authentication logic here
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <Routes />;
}

export default App;
