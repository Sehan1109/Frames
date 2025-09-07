// ItemPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage?: string;
  images?: string[];
}

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await axios.get(`http://localhost:5000/api/items/${id}`);
      setItem(res.data);
    };
    fetchItem();
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4 bg-gray-100 text-black">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Cover Image & extra images */}
            <div>
              {item.coverImage && (
                <img
                  src={`http://localhost:5000/${item.coverImage}`}
                  alt={item.title}
                  className="w-full h-80 object-cover rounded-lg shadow mb-4"
                />
              )}
              {/* Show other images */}
              <div className="grid grid-cols-3 gap-2">
                {item.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:5000/${img}`}
                    alt={`extra-${idx}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div>
              <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
              <p className="text-gray-600 mb-6">{item.description}</p>
              <p className="text-2xl font-bold mb-6">${item.price}</p>
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
                Buy
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
