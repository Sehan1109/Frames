import { useState } from "react";
import { FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const Footer = () => {
  // State for the contact form
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setFormStatus({ message: "Please fill in all fields.", type: "error" });
      return;
    }

    setLoading(true);
    setFormStatus({ message: "", type: "" });

    try {
      await axios.post(`${API_BASE}/contact/send`, { email, message });
      setFormStatus({
        message: "Message sent successfully!",
        type: "success",
      });
      setEmail("");
      setMessage("");
    } catch (err) {
      setFormStatus({
        message: "Failed to send message. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Footer Container */}
      <footer className="bg-white text-black py-10 px-6 md:px-12 lg:px-32 xl:px-52 flex flex-col md:flex-row justify-between gap-10 md:gap-20">
        {/* Contact Us Section */}
        <div className="w-full md:w-2/3 flex flex-col text-center md:text-left">
          <p className="font-semibold text-lg mb-4">Contact Us</p>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border rounded-lg text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {formStatus.message && (
              <p
                className={`text-sm mt-2 ${
                  formStatus.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formStatus.message}
              </p>
            )}
          </form>
        </div>

        {/* Links & Social Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start gap-8 text-center md:text-left">
          {/* Navigation Links */}
          <div className="w-full">
            <p className="font-semibold text-lg mb-4">Links</p>
            <div className="space-y-2 flex flex-col items-center md:items-start">
              <a href="#about" className="hover:underline">
                About Us
              </a>
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="w-full">
            <p className="font-semibold text-lg mb-4">Follow Us</p>
            <div className="flex gap-6 justify-center md:justify-start">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-gray-600 transition transform hover:scale-110"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                aria-label="Tiktok"
                className="hover:text-gray-600 transition transform hover:scale-110"
              >
                <FaTiktok size={24} />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="hover:text-gray-600 transition transform hover:scale-110"
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Bar */}
      <div className="bg-black text-white text-center py-4 text-sm px-4">
        © {new Date().getFullYear()} All Rights Reserved
      </div>
    </div>
  );
};

export default Footer;
