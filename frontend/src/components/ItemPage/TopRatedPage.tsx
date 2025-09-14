import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import Footer from "../Footer";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
}

const TopRatedPage = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchTopRatedItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/items/top/rated/all"
        );
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching top rated items:", error);
      }
    };

    fetchTopRatedItems();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <section className="py-12">
        <h2 className="text-center text-2xl font-semibold mb-8">
          Top Rated Items
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {items.map((item) => (
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
      </section>
      <Footer />
    </div>
  );
};

export default TopRatedPage;
