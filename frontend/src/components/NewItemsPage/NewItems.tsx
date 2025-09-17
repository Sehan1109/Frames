import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
}

export default function NewItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Item[]>(`${API_BASE}/items/all`);
        setItems(res.data);
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error(
            "Axios error fetching items:",
            err.response?.data || err.message
          );
        } else {
          console.error("Unknown error fetching items:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  function isAxiosError(
    error: unknown
  ): error is { isAxiosError: true; response?: any; message?: string } {
    return (
      typeof error === "object" &&
      error !== null &&
      "isAxiosError" in error &&
      (error as any).isAxiosError === true
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-1 py-40 px-4 sm:px-8 lg:px-16">
        <h2 className="text-black text-center text-3xl font-extrabold mb-10">
          🆕 All New Items
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
                <div className="bg-white rounded-xl shadow-md hover:shadow-2xl overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col">
                  {item.coverImage && (
                    <div className="relative">
                      <img
                        src={`${API_BASE.replace("/api", "")}/uploads/${
                          item.coverImage
                        }`}
                        alt={item.title}
                        className="w-full h-56 object-cover group-hover:opacity-90 transition"
                      />
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                        New
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
            No items found at the moment.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
