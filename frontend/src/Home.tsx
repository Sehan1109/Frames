import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
}

const Home = () => {
  const [latestItems, setLatestItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items/latest");
        setLatestItems(res.data);
      } catch (err) {
        console.error("Error fetching latest items:", err);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center py-12">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <img
            src="../src/assets/image7.png"
            alt="Hero"
            className="rounded-lg shadow-md-w-[500px]"
          />
          <h2 className="text-4xl font-extrabold">
            Fujo <br /> Frame
          </h2>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bg-black text-white py-12">
        <h2 className="text-center text-2xl font-semibold mb-8">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Phones", img: "/src/assets/image1.png" },
            { name: "Watches", img: "/src/assets/image2.png" },
            { name: "Accessories", img: "/src/assets/image3.png" },
            { name: "Others", img: "/src/assets/image4.png" },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${cat.name}`}
              className="flex flex-col items-center bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-48 object-cover"
              />
              <p className="py-2 text-black font-medium">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New Ones */}
      <section id="top-picks" className="py-12">
        <h2 className="text-center text-2xl font-semibold mb-8">New Ones</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {latestItems.map((item) => (
            <Link
              key={item._id}
              to={`/item/${item._id}`}
              className="flex flex-col items-center bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform"
            >
              {item.coverImage && (
                <img
                  src={`http://localhost:5000/${item.coverImage}`}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <p className="py-2 text-black font-medium">{item.title}</p>
              <p className="px-4 text-center text-sm text-gray-500 flex-grow">
                {item.description}
              </p>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Link
            to="/items"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            More →
          </Link>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="bg-black text-white py-12 px-8 md:px-20">
        <h2 className="text-center text-2xl font-semibold mb-6">About us</h2>
        <p className="max-w-4xl mx-auto text-center leading-relaxed text-gray-300">
          “For me, there is something indulgent about old technology. The
          efforts put in by every party who made every semiconductor work, gave
          every retro phone their unique story. Mobile phones were, are, and
          will always be an indispensable part of our lives. What I do is spice
          them up with a sprinkle of admiration. I hope these items from the
          good old days will bring reminiscence, astonishment and happiness to
          those who still appreciate them. They will also be a gentle reminder
          of this ever-evolving day and age.”
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
