import axios from "axios";
import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE as string;

// --- SVG ICONS ---
const ExclamationTriangleIcon = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.515 2.625H3.72c-1.345 0-2.188-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path
      fillRule="evenodd"
      d="M.664 10.59a1.651 1.651 0 010-1.18l.8-1.333A1.651 1.651 0 012.986 8h14.028a1.651 1.651 0 011.523.898l.8 1.333a1.651 1.651 0 010 1.18l-.8 1.333a1.651 1.651 0 01-1.523.898H2.986a1.651 1.651 0 01-1.523-.898l-.8-1.333zM10 15a5 5 0 100-10 5 5 0 000 10z"
      clipRule="evenodd"
    />
  </svg>
);
const EyeSlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38c-1.54-2.922-4.48-5-8.075-5a9.96 9.96 0 00-4.502 1.043L3.28 2.22zM7.5 10a2.5 2.5 0 005 0a2.5 2.5 0 00-5 0z"
      clipRule="evenodd"
    />
    <path d="M7.054 14.78A9.957 9.957 0 0110 15c3.595 0 6.534-2.078 8.075-5a10.03 10.03 0 00-3.3-4.38l-1.5 1.5A3.987 3.987 0 0114.985 10a3.987 3.987 0 01-1.15 2.877l-1.5 1.5zm-3.8-1.055a.75.75 0 00-1.06-1.06L.92 14.03a.75.75 0 101.06 1.06l1.273-1.273z" />
  </svg>
);

// --- Alert Component ---
interface AlertMessageProps {
  type: "error" | "success";
  message: string | null;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  if (!message) return null;
  const isError = type === "error";
  const bgColor = isError ? "bg-red-100" : "bg-green-100";
  const borderColor = isError ? "border-red-400" : "border-green-400";
  const textColor = isError ? "text-red-700" : "text-green-700";
  const Icon = isError ? ExclamationTriangleIcon : CheckCircleIcon;
  return (
    <div
      className={`p-3 rounded-lg border ${bgColor} ${borderColor} ${textColor} flex items-center space-x-2`}
      role="alert"
    >
      <Icon />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// **NEW**: Type guard for Axios errors (for consistency)
function isAxiosError(
  error: unknown
): error is { isAxiosError: boolean; response?: any } {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

// --- SignUp Component ---

interface SignUpProps {
  onSuccess: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${API_BASE}/auth/register`, { name, email, password });
      setSuccess("Account created successfully! You can now log in.");
      // This tells the Navbar to switch back to the Login view
      setTimeout(onSuccess, 1500);
    } catch (err: unknown) {
      // **CHANGED**: from 'any' to 'unknown'
      // **CHANGED**: Implemented type guard for better error messages
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Signup failed. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">
        Create Account
      </h2>

      <form onSubmit={handleSignUp} className="space-y-4">
        <AlertMessage type="error" message={error} />
        <AlertMessage type="success" message={success} />

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="e.g. Jane Doe"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          />
          _{" "}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email _      {" "}
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Password _  {" "}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-yellow-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full py-3 rounded-lg font-semibold bg-yellow-400 text-black hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : null}
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
