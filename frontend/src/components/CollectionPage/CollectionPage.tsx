// CategoryPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage?: string;
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Item[]>(
          `${API_BASE}/items/category/${category}`
        );
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching category items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [category]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-40 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-gray-100 to-gray-200">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold mb-10 text-gray-900">
          {category} Collection
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {items.map((item) => (
              <Link
                to={`/item/${item._id}`}
                key={item._id}
                className="group no-underline"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                  {item.coverImage && (
                    <div className="relative">
                      <img
                        src={`${API_BASE.replace("/api", "")}/uploads/${
                          item.coverImage
                        }`}
                        alt={item.title}
                        className="w-full h-56 object-cover group-hover:opacity-90 transition"
                      />
                      <span className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
                        {item.category}
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-800">
                        ${item.price}
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
            No items found in this category.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
