import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { supabase } from "../../supabaseClient";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.error_description || error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-8 bg-card border border-border rounded-lg shadow-lg">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Wing Cash Movement</h1>
            <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            required
            placeholder="user@wingbank.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <Button type="submit" className="w-full" loading={loading} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
