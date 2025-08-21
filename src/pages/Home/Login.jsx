// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";

export default function Login() {
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();
  const { user } = useUser();

  // Save user to backend
  const saveUserToBackend = async (userData) => {
    try {
      await fetch("http://localhost:5000/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // Redirect after login/signup
  useEffect(() => {
    if (user) {
      const userData = {
        clerk_id: user.id,
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      };
      saveUserToBackend(userData);
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative">
      {/* Background Glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Welcome Back ✨
        </h1>
        <p className="text-gray-300 mb-8">
          Sign in to access your dashboard <br /> or create a new account
        </p>

        {/* Tabs */}
        <div className="flex mb-10 bg-white/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-3 font-semibold transition-all duration-300 ${
              activeTab === "signin"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 font-semibold transition-all duration-300 ${
              activeTab === "signup"
                ? "bg-gradient-to-r from-green-400 to-teal-500 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Clerk Buttons */}
        {activeTab === "signin" && (
          <SignInButton mode="modal">
            <button
              type="button"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:scale-105 transform text-white rounded-xl font-bold shadow-lg transition-all duration-300"
            >
              🚀 Sign In with Clerk
            </button>
          </SignInButton>
        )}

        {activeTab === "signup" && (
          <SignUpButton mode="modal">
            <button
              type="button"
              className="w-full py-3 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:scale-105 transform text-white rounded-xl font-bold shadow-lg transition-all duration-300"
            >
              ✨ Sign Up with Clerk
            </button>
          </SignUpButton>
        )}

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-8">
          By continuing, you agree to our{" "}
          <span className="text-pink-400 hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          &{" "}
          <span className="text-pink-400 hover:underline cursor-pointer">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}
