import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import Login from "./pages/Login";
import { loadFromStorage } from "./utils/storage";

function App() {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [currentUser, setCurrentUser] = useState(null);

 const handleLogin = (e) => {
   e.preventDefault();
   const email = e.target.email.value;
   const password = e.target.password.value;

   const users = loadFromStorage('users') || [];
   const foundUser = users.find(user => user.email === email && user.password === password);

   if (foundUser) {
     setCurrentUser(foundUser);
     setIsAuthenticated(true);
   } else {
     alert("Invalid email or password.");
   }
 };

 if (!isAuthenticated) {
   return <Login onLogin={handleLogin} />;
 }

 // Pass the logged-in user to the routes
 return <Routes user={currentUser} />;
}

export default App;
