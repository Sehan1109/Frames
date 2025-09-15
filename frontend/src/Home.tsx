import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
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

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get<Item[]>(`${API_BASE}/items/latest`);
        setLatestItems(res.data);
      } catch (err) {
        console.error("Error fetching latest items:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get<Review[]>(`${API_BASE}/items/reviews/all`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    const fetchTopRated = async () => {
      try {
        const res = await axios.get<Item[]>(`${API_BASE}/items/top/rated`);
        setTopRatedItems(res.data);
      } catch (err) {
        console.error("Error fetching top rated items:", err);
      }
    };

    fetchLatest();
    fetchReviews();
    fetchTopRated();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center py-20">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <img
            src={image7}
            alt="Hero"
            className="rounded-lg shadow-md w-[500px]"
          />
          <h2 className="text-4xl font-extrabold">
            Fujo <br /> Frame
          </h2>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bg-black text-white py-20">
        <h2 className="text-center text-2xl font-semibold mb-8">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Phones", img: image1 },
            { name: "Watches", img: image2 },
            { name: "Accessories", img: image3 },
            { name: "Others", img: image4 },
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
      <section id="new-ones" className="py-12 bg-gray-100">
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
                  src={`${API_BASE.replace("/api", "")}/${item.coverImage}`}
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

      {/* Top Rated Section */}
      <section id="top-rated" className="bg-black py-12">
        <h2 className="text-center text-2xl font-semibold mb-8 text-white">
          Top Rated
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {topRatedItems.map((item) => (
            <Link
              key={item._id}
              to={`/item/${item._id}`}
              className="flex flex-col items-center bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform"
            >
              {item.coverImage && (
                <img
                  src={`${API_BASE.replace("/api", "")}/${item.coverImage}`}
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
            to="/top-rated"
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            More →
          </Link>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 text-black bg-gray-100">
        <h2 className="text-center text-2xl font-semibold mb-8">
          What Our Customers Say
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
            <div
              key={review._id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition bg-gray-50"
            >
              {/* Item Info */}
              <div className="flex items-center mb-3">
                {review.coverImage && (
                  <img
                    src={`${API_BASE.replace("/api", "")}/${review.coverImage}`}
                    alt={review.itemTitle}
                    className="w-12 h-12 rounded object-cover mr-3"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-sm">{review.itemTitle}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* User & Rating */}
              <div className="flex items-center mb-2">
                <span className="font-bold">{review.user.name}</span>
                <span className="ml-2 text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>

              {/* Comment */}
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>

        {reviews.length > 3 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              {showAllReviews ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </section>

      {/* About Us */}
      <section id="about" className="bg-black text-white py-20 px-8 md:px-20">
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
