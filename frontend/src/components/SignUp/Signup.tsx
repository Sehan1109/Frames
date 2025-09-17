import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

interface SignupResponse {
  token: string;
  isAdmin: boolean;
}

// Custom Axios error type guard
function isAxiosError(
  error: unknown
): error is {
  isAxiosError: true;
  response?: { data?: any };
  message?: string;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as any).isAxiosError === true
  );
}

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post<SignupResponse>(`${API_BASE}/auth/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Store token & user info in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", String(res.data.isAdmin));

      // Redirect like login
      navigate(res.data.isAdmin ? "/admin" : "/");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setMessage(
          err.response?.data?.message || err.message || "Signup failed"
        );
      } else {
        setMessage("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl drop-shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
