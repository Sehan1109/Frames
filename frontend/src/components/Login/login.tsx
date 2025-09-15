import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE as string;

interface LoginResponse {
  token: string;
  isAdmin: boolean;
}

// ✅ Type guard for Axios errors
function isAxiosError(
  error: unknown
): error is { isAxiosError: boolean; response?: any } {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post<LoginResponse>(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      // ✅ Save token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", String(res.data.isAdmin));

      navigate(res.data.isAdmin ? "/admin" : "/");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        alert(err.response?.data?.message || "Login failed");
      } else {
        alert("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl drop-shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
