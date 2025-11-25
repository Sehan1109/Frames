import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import image1 from "./assets/image1.png";
import image2 from "./assets/image2.png";
import image3 from "./assets/image3.png";
import image4 from "./assets/image4.png";
import image7 from "./assets/image7.png";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
}

interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
  itemId: string;
  itemTitle: string;
  coverImage?: string;
}

const Home = () => {
  const [latestItems, setLatestItems] = useState<Item[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [topRatedItems, setTopRatedItems] = useState<Item[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latest, reviewData, topRated] = await Promise.all([
          axios.get(`${API_BASE}/items/latest`),
          axios.get(`${API_BASE}/items/reviews/all`),
          axios.get(`${API_BASE}/items/top/rated/all`),
        ]);

        setLatestItems(Array.isArray(latest.data) ? latest.data : []);
        setReviews(Array.isArray(reviewData.data) ? reviewData.data : []);
        setTopRatedItems(Array.isArray(topRated.data) ? topRated.data : []);
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };
    fetchData();

    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state]);

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const displayedReviews = showAllReviews
    ? safeReviews
    : safeReviews.slice(0, 5);

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-44 bg-white text-black overflow-hidden">
        <motion.img
          src={image7}
          alt="Hero"
          className="rounded-2xl shadow-lg w-[320px] md:w-[500px] mb-6 md:mb-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="md:ml-12 text-center md:text-left"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Fujo <span className="text-yellow-400">Frame</span>
          </h2>
          <p className="mt-4 text-lg text-gray-800 max-w-lg">
            Discover rare retro tech and modern classics, all in one place.
          </p>
          <Link
            to="/items"
            className="inline-block mt-6 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-300 transition"
          >
            Shop Now →
          </Link>
        </motion.div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-black text-white">
        <h2 className="text-center text-3xl font-bold mb-10">Categories</h2>

        <div className="flex md:grid md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 md:pb-0">
          {[
            { name: "Phones", img: image1 },
            { name: "Watches", img: image2 },
            { name: "Accessories", img: image3 },
            { name: "Others", img: image4 },
          ].map((cat, i) => (
            <motion.div
              key={cat.name}
              className="min-w-[200px] md:min-w-0 flex-shrink-0 snap-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.3, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <Link
                to={`/category/${cat.name}`}
                className="relative group rounded-2xl overflow-hidden shadow-xl block h-full"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 bg-gray-200 rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white text-xl font-semibold">{cat.name}</p>
                </div>
                <div className="p-4">
                  <p className="text-gray-100 text-xl font-semibold text-center">
                    {cat.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Ones */}
      <section id="new-ones" className="py-20 bg-white">
        <h2 className="text-center text-3xl font-bold mb-10">New Ones</h2>

        <div className="flex md:grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 md:pb-0">
          {(Array.isArray(latestItems) ? latestItems : []).map((item, i) => (
            <motion.div
              key={item._id}
              className="min-w-[260px] md:min-w-0 flex-shrink-0 snap-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/item/${item._id}`}
                className="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden flex flex-col h-full border border-gray-100"
              >
                <div className="w-full h-48 relative bg-gray-200 flex-shrink-0">
                  {item.coverImage ? (
                    <img
                      src={`${API_BASE.replace("/api", "")}/uploads/${
                        item.coverImage
                      }`}
                      alt={item.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xs uppercase font-bold">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm flex-grow line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <span className="text-gray-800 font-bold mt-3">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/items"
            className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-300"
          >
            View More →
          </Link>
        </div>
      </section>

      {/* Top Rated */}
      <section id="top-rated" className="py-20 bg-black text-white">
        <h2 className="text-center text-3xl font-bold mb-10">Top Rated</h2>

        <div className="flex md:grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 md:pb-0">
          {(Array.isArray(latestItems) ? latestItems : []).map((item, i) => (
            <motion.div
              key={item._id}
              className="min-w-[260px] md:min-w-0 flex-shrink-0 snap-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/item/${item._id}`}
                className="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden flex flex-col h-full border border-gray-100"
              >
                <div className="w-full h-48 relative bg-gray-200 flex-shrink-0">
                  {item.coverImage ? (
                    <img
                      src={`${API_BASE.replace("/api", "")}/uploads/${
                        item.coverImage
                      }`}
                      alt={item.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg line-clamp-1 text-black">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm flex-grow line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <span className="text-gray-800 font-bold mt-3">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/items"
            className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-gray-800 transition"
          >
            View More →
          </Link>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-gray-100">
        <h2 className="text-center text-3xl font-bold mb-10">
          What Our Customers Say
        </h2>

        <div className="flex md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 md:pb-0">
          {displayedReviews.map((review, i) => (
            <motion.div
              key={review._id}
              className="min-w-[300px] md:min-w-0 flex-shrink-0 snap-center bg-white rounded-xl shadow hover:shadow-lg p-6 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                {review.coverImage && (
                  <img
                    src={`${API_BASE.replace("/api", "")}/uploads/${
                      review.coverImage
                    }`}
                    alt={review.itemTitle}
                    className="w-12 h-12 rounded mr-3 object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{review.itemTitle}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <span className="font-bold">{review.user.name}</span>
                <span className="ml-2 text-yellow-500 text-sm">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </motion.div>
          ))}
        </div>

        {safeReviews.length > 5 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-gray-800 transition"
            >
              {showAllReviews ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-black text-white px-8 md:px-20">
        <h2 className="text-center text-3xl font-bold mb-6">About Us</h2>
        <p className="max-w-4xl mx-auto text-center text-lg text-gray-300 leading-relaxed">
          “For me, there is something indulgent about old technology. The
          efforts put in by every party who made every semiconductor work gave
          every retro phone their unique story. Mobile phones were, are, and
          will always be an indispensable part of our lives. What I do is spice
          them up with a sprinkle of admiration. I hope these items from the
          good old days will bring reminiscence, astonishment and happiness to
          those who still appreciate them.”
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
