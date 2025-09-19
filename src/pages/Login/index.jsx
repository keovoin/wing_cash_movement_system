import React from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { saveToStorage } from "../../utils/storage"; // <-- Import the save function

const Login = ({ onLogin }) => {

  // --- NEW FUNCTION TO CREATE THE DEFAULT ADMIN ---
  const handleReset = () => {
    const defaultAdmin = {
      id: Date.now(),
      name: 'Default Admin',
      email: 'admin@wingbank.com',
      password: 'password',
      role: 'Banking Operations',
      branch: 'Head Office',
      status: 'active',
      lastLogin: new Date().toISOString()
    };
    saveToStorage('users', [defaultAdmin]);
    alert("Default admin account has been created/reset. Please try logging in again with email: admin@wingbank.com and password: password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-8 bg-card border border-border rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Wing Cash Movement
              </h1>
              <p className="text-muted-foreground">
                Please sign in to continue
              </p>
            </div>
          </div>
        </div>
        <form className="space-y-6" onSubmit={onLogin}>
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@wingbank.com"
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="password"
          />
          
          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
        {/* --- NEW RESET BUTTON AND HELPER TEXT --- */}
        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          <p>Can't log in or first time using the app?</p>
          <Button variant="link" onClick={handleReset} className="text-primary">
            Reset / Create Default Admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
