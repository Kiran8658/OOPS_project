import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginProps {
  onLogin: () => void;
}

interface User {
  username: string;
  email: string;
  password: string;
}

export default function Login({ onLogin }: Readonly<LoginProps>) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  // Load saved users
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) setUsers(JSON.parse(storedUsers));
  }, []);

  // Save users
  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      if (users.find((u) => u.username === username)) {
        setError("Username already exists!");
        return;
      }

      const newUser: User = { username, email, password };
      saveUsers([...users, newUser]);
      alert("🎉 Registration successful! Please login.");
      setIsRegister(false);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      const existingUser = users.find(
        (u) => u.username === username && u.password === password
      );
      if (!existingUser) {
        setError("Invalid username or password!");
        return;
      }
      alert(`👋 Welcome back, ${existingUser.username}!`);
      onLogin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header / Hero section like landing page */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >

        <h1 className="mt-4 text-4xl font-extrabold text-gray-800">
          {isRegister ? "Create Your Account" : "Smart Shelf Management System"}
        </h1>
        <p className="mt-2 text-gray-500 max-w-lg mx-auto">
          {isRegister
            ? "Register to start using the platform."
            : "Sign in to continue. Automate workflows."}
        </p>
      </motion.div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email (only register) */}
          {isRegister && (
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password (only register) */}
          {isRegister && (
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 text-center font-medium">
              {error}
            </p>
          )}

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              {isRegister ? "Register" : "Login"}
            </Button>
          </motion.div>
        </form>

        {/* Toggle */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 hover:underline"
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
