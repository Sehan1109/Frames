import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import Footer from "../Footer";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
}

const TopRatedPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRatedItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/items/top/rated/all`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching top rated items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedItems();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-black flex flex-col">
      <Navbar />
      <section className="py-40 px-4 sm:px-8 lg:px-16 flex-1">
        <h2 className="text-center text-3xl font-extrabold mb-10 text-gray-900">
          ⭐ Top Rated Items
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {items.map((item) => (
              <Link
                key={item._id}
                to={`/item/${item._id}`}
                className="group no-underline"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
                  {item.coverImage && (
                    <div className="relative">
                      <img
                        src={`${API_BASE}/uploads/${item.coverImage}`}
                        alt={item.title}
                        className="w-full h-56 object-cover group-hover:opacity-90 transition"
                      />
                      <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                        Top Rated
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-lg font-bold text-gray-800">
                        ${item.price.toFixed(2)}
                      </p>
                      <button className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No top-rated items found.
          </p>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default TopRatedPage;
