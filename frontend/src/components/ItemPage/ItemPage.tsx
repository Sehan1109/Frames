import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import StarRating from "../StarRating/StarRating";
import ReviewModal from "../ReviewModal/ReviewModal";
import { Globe, CheckCircle, Gift, Lock } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import OrderModal from "../Modal/OrderModal";

const API_BASE = import.meta.env.VITE_API_BASE as string;

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage?: string;
  images?: string[];
  rating?: number;
  numReviews?: number;
}

interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

function isAxiosError(
  error: unknown
): error is { isAxiosError: boolean; response?: any } {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [mainImage, setMainImage] = useState<string | null>(null);

  const handleOrderSubmit = async (orderData: {
    name: string;
    address: string;
    whatsapp: string;
    quantity: number;
  }) => {
    if (!item) return;

    try {
      await axios.post(
        `${API_BASE}/orders`,
        {
          productId: item._id,
          ...orderData,
          price: item.price * orderData.quantity,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Order placed successfully ✅");
    } catch (err) {
      alert("Failed to place order ❌");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resItem = await axios.get<Item>(`${API_BASE}/items/${id}`);
        setItem(resItem.data);
        setMainImage(
          resItem.data.coverImage
            ? `${API_BASE.replace("/api", "")}/uploads/${
                resItem.data.coverImage
              }`
            : null
        );

        const resReviews = await axios.get<Review[]>(
          `${API_BASE}/items/${id}/reviews`
        );
        setReviews(resReviews.data);
      } catch (err: unknown) {
        if (isAxiosError(err)) console.error(err.response?.data);
        else console.error(err);
      }
    };
    fetchData();
  }, [id]);

  if (!item) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12">
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Image Gallery */}
            <div className="flex flex-col items-center">
              {mainImage && (
                <img
                  src={mainImage}
                  alt={item.title}
                  className="w-full max-w-md h-96 object-cover rounded-xl shadow-md mb-4 transition-transform hover:scale-105"
                />
              )}
              <div className="grid grid-cols-4 gap-2 w-full max-w-md">
                {item.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${API_BASE.replace("/api", "")}/uploads/${img}`}
                    alt={`thumb-${idx}`}
                    className={`h-20 object-cover rounded-md cursor-pointer border-2 transition ${
                      mainImage?.includes(img)
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() =>
                      setMainImage(
                        `${API_BASE.replace("/api", "")}/uploads/${img}`
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-extrabold mb-4">{item.title}</h1>
                <div
                  className="flex items-center gap-2 mb-4 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <StarRating value={item.rating || 0} size={24} readOnly />
                  <span className="text-gray-600">
                    ({item.numReviews} reviews)
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-4">
                  ${item.price} USD
                </p>
                <p className="text-gray-600 mb-6">{item.description}</p>

                {/* Highlights */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Globe size={20} /> Worldwide Shipping
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={20} /> Handcrafted with Care
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Gift size={20} /> Gift Wrapped
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Lock size={20} /> Secure Payments
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border bg-gray-400 hover:bg-gray-500 transition font-semibold"
                  onClick={() =>
                    addToCart({
                      _id: item._id,
                      title: item.title,
                      price: item.price,
                      coverImage: item.coverImage,
                      quantity: 1,
                    })
                  }
                >
                  Add to Cart
                </button>
                <button
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition font-semibold"
                  onClick={() => setIsModalOpen(true)}
                >
                  Order
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <StarRating value={item.rating || 0} size={24} readOnly />
                <p className="text-gray-600">
                  Based on {item.numReviews} reviews
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
              >
                Write a Review
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.length === 0 && <p>No reviews yet.</p>}
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="bg-gray-50 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <p className="font-bold">{r.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <StarRating value={r.rating} size={18} readOnly />
                  </div>
                  <p className="mt-2 text-gray-700">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleOrderSubmit}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemId={item._id}
        onReviewSubmitted={async () => {
          const res = await axios.get<Review[]>(
            `${API_BASE}/items/${item._id}/reviews`
          );
          setReviews(res.data);
        }}
      />
    </div>
  );
}
