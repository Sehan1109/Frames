import { useState } from "react";
import { FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";
import axios from "axios"; // Import axios

// Get the API base URL from your .env file
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
      // Call the new backend endpoint
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
    <div>
      {/* Footer */}
      <footer className="bg-white text-black py-20 px-52 flex flex-col md:flex-row justify-between text-center md:text-left gap-12">
        {/* Updated Contact Us Section */}
        <div className="w-full md:w-2/3">
          <p className="font-semibold text-lg mb-4">Contact Us</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
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

        {/* Links Section */}
        <div className="w-full md:w-auto space-y-3">
          <p className="font-semibold text-lg mb-4 invisible hidden md:block">
            Links
          </p>{" "}
          {/* Spacer */}
          <a href="#about" className="block hover:underline">
            About Us
          </a>
          <a href="/privacy" className="block hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="block hover:underline">
            Terms of Service
          </a>
          <p className="font-semibold text-lg mb-4">Follow Us</p>
          <div className="flex space-x-6 justify-center md:justify-start">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-gray-600 transition"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="#"
              aria-label="Tiktok"
              className="hover:text-gray-600 transition"
            >
              <FaTiktok size={24} />
            </a>
            <a
              href="#"
              aria-label="Youtube"
              className="hover:text-gray-600 transition"
            >
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
      </footer>

      <div className="bg-black text-white text-center py-4 text-sm">
        © All Right Reserved
      </div>
    </div>
  );
};

export default Footer;
