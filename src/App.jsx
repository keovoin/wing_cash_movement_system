import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import Login from "./pages/Login";
import { loadFromStorage, saveToStorage } from "./utils/storage";

function App() {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [currentUser, setCurrentUser] = useState(null);

 // --- NEW LOGIC TO CREATE A DEFAULT ADMIN ON FIRST RUN ---
 useEffect(() => {
   const users = loadFromStorage('users');
   if (!users || users.length === 0) {
     // If no users exist, create a default admin
     const defaultAdmin = {
       id: Date.now(),
       name: 'Default Admin',
       email: 'admin.dbp@wingbank.com',
       password: 'Juniper@123',
       role: 'Banking Operations',
       branch: 'Head Office',
       status: 'active',
       lastLogin: new Date().toISOString()
     };
     saveToStorage('users', [defaultAdmin]);
     console.log('Default admin user has been created.');
   }
 }, []); // This runs only once when the app starts

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
     // --- ADDED ALERT FOR FAILED LOGIN ---
     alert("Invalid email or password. Please try again.");
   }
 };

 if (!isAuthenticated) {
   return <Login onLogin={handleLogin} />;
 }

 // Pass the logged-in user to the routes
 return <Routes user={currentUser} />;
}

export default App;
