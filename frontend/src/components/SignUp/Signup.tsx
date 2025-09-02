import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      setMessage(res.data.msg);
    } catch (err: any) {
      setMessage(err.response?.data?.msg || "Error signing up");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded">
        Sign Up
      </button>
      {message && <p className="text-center text-sm text-gray-600">{message}</p>}
    </form>
  );
};

export default SignUp;
