// src/pages/Login.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login as loginUser, register as registerUser } from "../api/AuthService";
import { useNavigate } from "react-router-dom";
import { X, Package, BarChart3, Bell, Users, TrendingUp, Shield } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }
        await registerUser({ username, password, email });
        alert("🎉 Registration successful! Please login.");
        setIsRegister(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const response = await loginUser({ username, password });
        if (response?.username) {
          onLogin();
          alert(`👋 Welcome, ${response.username}!`);
          setUsername("");
          setPassword("");
          setShowAuthModal(false);
          navigate("/dashboard");
        } else {
          setError("Invalid username or password!");
        }
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openAuthModal = (register: boolean) => {
    setIsRegister(register);
    setShowAuthModal(true);
    setError("");
  };

  const features = [
    {
      icon: <Package className="w-8 h-8" />,
      title: "Real-time Inventory Tracking",
      description: "Monitor stock levels across multiple locations with live updates and instant notifications."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Get insights into sales trends, stock movement, and predictive analytics for better decisions."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Automated notifications for low stock, expiring items, and reorder points."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-user Access",
      description: "Collaborate with your team with role-based permissions and access controls."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Sales Integration",
      description: "Seamlessly connect with your sales channels and sync inventory automatically."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with automatic backups and data protection."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef5f1] via-[#fff8f6] to-[#fef5f1]">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-[#d8272d]" />
              <span className="text-2xl font-bold text-[#d8272d]">Smart Shelf</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#d8272d] transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#solutions" className="text-gray-700 hover:text-[#d8272d] transition-colors text-sm font-medium">
                Solutions
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-[#d8272d] transition-colors text-sm font-medium">
                Pricing
              </a>
              <a href="#resources" className="text-gray-700 hover:text-[#d8272d] transition-colors text-sm font-medium">
                Resources
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => openAuthModal(false)}
                className="text-[#d8272d] font-semibold text-sm hover:underline transition-all"
              >
                SIGN IN
              </button>
              <button
                onClick={() => openAuthModal(true)}
                className="bg-[#d8272d] text-white px-6 py-2 rounded text-sm font-semibold hover:bg-[#b81e23] transition-colors shadow-md hover:shadow-lg"
              >
                SIGN UP NOW
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Inventory management made
              <span className="text-[#d8272d]"> simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Manage orders. Track inventory. Handle billing. Oversee warehouses. One inventory management software to run all your operations efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => openAuthModal(true)}
                className="bg-[#d8272d] text-white px-8 py-6 text-lg font-semibold hover:bg-[#b81e23] transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                className="border-2 border-[#d8272d] text-[#d8272d] px-8 py-6 text-lg font-semibold hover:bg-[#d8272d] hover:text-white transition-all"
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <div className="text-3xl font-bold text-[#d8272d]">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#d8272d]">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#d8272d]">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </motion.div>

          {/* Right Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-[#d8272d] to-[#b81e23] rounded-3xl shadow-2xl p-8 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              
              {/* Mock Dashboard */}
              <div className="relative bg-white rounded-2xl shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-gray-800">Inventory Dashboard</div>
                  <div className="w-10 h-10 bg-[#d8272d] rounded-lg"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,234</div>
                    <div className="text-xs text-gray-600">Total Items</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">₹45K</div>
                    <div className="text-xs text-gray-600">Revenue</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-700">Product A</div>
                      <div className="text-xs text-gray-500">In Stock: 145</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-700">Product B</div>
                      <div className="text-xs text-gray-500">In Stock: 89</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Your Business</h2>
          <p className="text-xl text-gray-600">Everything you need to manage inventory efficiently</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#d8272d] to-[#b81e23] rounded-xl flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to streamline your inventory?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of businesses managing their inventory smarter</p>
          <Button
            onClick={() => openAuthModal(true)}
            className="bg-white text-[#d8272d] px-10 py-6 text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Free Trial
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2025 Smart Shelf Inc. All rights reserved.
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#d8272d] to-[#b81e23] p-6 text-white relative">
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-bold">
                    {isRegister ? "Create Account" : "Welcome Back"}
                  </h2>
                  <p className="text-white/90 text-sm mt-1">
                    {isRegister
                      ? "Start managing your inventory today"
                      : "Sign in to continue to Smart Shelf"}
                  </p>
                </div>

                {/* Modal Body */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                      <Label htmlFor="username" className="text-gray-700 font-medium text-sm">
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="mt-1 h-11"
                        required
                      />
                    </div>

                    {/* Email (register only) */}
                    {isRegister && (
                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="mt-1 h-11"
                          required
                        />
                      </div>
                    )}

                    {/* Password */}
                    <div>
                      <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="mt-1 h-11"
                        required
                      />
                    </div>

                    {/* Confirm Password (register only) */}
                    {isRegister && (
                      <div>
                        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-sm">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          className="mt-1 h-11"
                          required
                        />
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-[#d8272d] text-white font-semibold py-3 h-12 rounded-md hover:bg-[#b81e23] transition-colors text-base"
                      disabled={loading}
                    >
                      {loading
                        ? isRegister
                          ? "Creating Account..."
                          : "Signing In..."
                        : isRegister
                        ? "SIGN UP"
                        : "SIGN IN"}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  {/* Toggle */}
                  <p className="text-center text-sm text-gray-600">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegister(!isRegister);
                        setError("");
                      }}
                      className="text-[#d8272d] font-semibold hover:underline"
                    >
                      {isRegister ? "Sign In" : "Sign Up"}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}