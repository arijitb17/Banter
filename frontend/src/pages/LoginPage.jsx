import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  const chats = [
    { user: "Alice", message: "Hey! Did you see the news today?" },
    { user: "Bob", message: "Yeah! That was crazy 😄" },
    { user: "Alice", message: "Let's catch up in the chat!" },
    { user: "Bob", message: "Sure, I'm in!" },
  ];

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-base-100">
      {/* Left Side - Form */}
      <div className="flex flex-1 justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-10 bg-card rounded-3xl shadow-xl p-10 animate-fadeIn">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-content text-2xl font-bold animate-pulse">
              <img
                  src="/logo.png" // <-- your logo path
                  alt="Banter Logo"
                  className="w-8 h-8 object-cover round" // adjust size as needed
                />
            </div>
            <h1 className="text-3xl font-extrabold text-base-content">Welcome Back</h1>
            <p className="text-base-content/60">Sign in to join the conversation!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Email</span>
              </label>
              <div className="relative w-full">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 rounded-xl border-base-300 focus:border-primary focus:ring focus:ring-primary/30 transition"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Password</span>
              </label>
              <div className="relative w-full">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10 rounded-xl border-base-300 focus:border-primary focus:ring focus:ring-primary/30 transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-base-content/60">
            Don’t have an account?{" "}
            <Link to="/signup" className="link link-primary">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Modern Chat Preview */}
<div className="hidden lg:flex flex-1 bg-base-200 rounded-3xl p-10 justify-center items-center overflow-hidden relative">
  {/* Moving shapes */}
  <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full animate-floatSlow"></div>
  <div className="absolute top-20 right-10 w-48 h-48 bg-secondary/20 rounded-3xl animate-floatSlow delay-2000"></div>
  <div className="absolute bottom-10 left-20 w-24 h-24 bg-primary/10 rounded-full animate-floatSlow delay-1000"></div>

  {/* Chat preview container */}
  <div className="flex flex-col gap-6 w-full max-w-md z-10">
    <div className="text-center mb-4">
      <h2 className="text-2xl font-bold text-base-content">Banter Preview</h2>
      <p className="text-base-content/60">See how conversations look before joining!</p>
    </div>

    {/* Chat messages */}
    {[
      { user: "Alice", message: "Hey! Did you see the news today?" },
      { user: "Bob", message: "Yeah! That was crazy 😄" },
      { user: "Alice", message: "Let's catch up in the chat!" },
      { user: "Bob", message: "Sure, I'm in!" },
      { user: "Alice", message: "Share ideas, memes & more 💡" },
    ].map((chat, idx) => (
      <div
        key={idx}
        className={`px-5 py-3 rounded-2xl shadow-md transform transition-all duration-500 hover:scale-105 ${
          idx % 2 === 0
            ? "bg-primary/80 text-primary-content self-start animate-popupLeft"
            : "bg-secondary/80 text-secondary-content self-end animate-popupRight"
        }`}
        style={{ animationDelay: `${idx * 0.5}s` }}
      >
        <span className="font-semibold">{chat.user}: </span>
        {chat.message}
      </div>
    ))}

    {/* Background overlay */}
    <div className="absolute inset-0 rounded-3xl bg-base-300/20 pointer-events-none"></div>
  </div>
</div>

    </div>
  );
};

export default LoginPage;
