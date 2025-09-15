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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Use generic type directly
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 py-12">
        <h2 className="text-black text-center text-2xl font-bold mb-8">
          All Items
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item) => (
            <Link
              key={item._id}
              to={`/item/${item._id}`}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:scale-105 transition-transform"
            >
              {item.coverImage && (
                <img
                  src={`${API_BASE}/uploads/${item.coverImage}`}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="font-semibold text-black">{item.title}</h3>
              <p className="text-gray-500">{item.description}</p>
              <p className="text-black text-lg font-bold mt-2">${item.price}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
