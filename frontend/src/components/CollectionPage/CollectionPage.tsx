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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get<Item[]>(
          `${API_BASE}/items/category/${category}`
        );
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching category items:", err);
      }
    };
    fetchItems();
  }, [category]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-200 text-black">
        <h2 className="text-center text-2xl font-bold mb-8">
          {category} Collection
        </h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {items.map((item) => (
              <Link
                to={`/item/${item._id}`}
                key={item._id}
                className="no-underline text-black"
              >
                <div className="bg-white rounded-lg shadow-md p-4 text-center hover:scale-105 transition-transform">
                  {item.coverImage && (
                    <img
                      src={`${API_BASE.replace("/api", "")}/uploads/${
                        item.coverImage
                      }`}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-lg font-bold mt-2">${item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No items found in this category.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
