import { FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-white text-black py-20 px-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div>
          <p className="font-semibold">Contact Us</p>
          <p className="text-gray-600">example@gamil.com</p>
          <p className="font-semibold mt-4">Follow Us</p>
          <div className="flex space-x-4 mt-2 justify-center md:justify-start">
            <FaFacebook size={20} />
            <FaTiktok size={20} />
            <FaYoutube size={20} />
          </div>
        </div>

        <div className="mt-6 md:mt-0 space-y-2">
          <a href="#about" className="block hover:underline">
            About Us
          </a>
          <a href="/privacy" className="block hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="block hover:underline">
            Terms of Service
          </a>
        </div>
      </footer>

      <div className="bg-black text-white text-center py-4 text-sm">
        © All Right Reserved
      </div>
    </div>
  );
};

export default Footer;
