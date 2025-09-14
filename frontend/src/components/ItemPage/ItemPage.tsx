// ItemPage.tsx
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

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      const resItem = await axios.get(`http://localhost:5000/api/items/${id}`);
      setItem(resItem.data);

      const resReviews = await axios.get(
        `http://localhost:5000/api/items/${id}/reviews`
      );
      setReviews(resReviews.data);
    };
    fetchData();
  }, [id]);

  const submitReview = async (
    rating: number,
    comment: string,
    images: File[]
  ) => {
    try {
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("comment", comment);

      // ✅ match field name with backend ("reviewImages")
      images.forEach((img) => {
        formData.append("reviewImages", img);
      });

      await axios.post(
        `http://localhost:5000/api/items/${id}/reviews`,
        formData, // ✅ send FormData
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // refresh reviews after submit
      const res = await axios.get(
        `http://localhost:5000/api/items/${id}/reviews`
      );
      setReviews(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  const handleCheckout = async () => {
    try {
      const cartData = [
        {
          _id: item!._id,
          title: item!.title,
          price: item!.price,
          quantity: 1,
        },
      ];

      const res = await axios.post(
        "http://localhost:5000/api/payments/create-checkout-session",
        { cart: cartData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const sessionId = res.data.id;

      //Load Stripe.js
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
      );

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        alert("Stripe failed to load. Please try again later.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Checkout failed");
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4 bg-gray-100 text-black">
        <div className="max-w-6xl mx-auto bg-white p-20 rounded-lg shadow-md">
          {/* Grid layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Images */}
            <div>
              {item.coverImage && (
                <img
                  src={`http://localhost:5000/${item.coverImage}`}
                  alt={item.title}
                  className="w-96 h-96 object-cover rounded-lg shadow mb-4"
                />
              )}
            </div>

            {/* Right: Details */}
            <div className="px-8">
              <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
              <div
                className="font-bold flex items-center cursor-pointer mb-4"
                onClick={() => setIsModalOpen(true)} // ⭐ click stars -> open modal
              >
                <StarRating value={item.rating || 0} size={28} readOnly />
                <span className="ml-2">({item.numReviews} reviews)</span>
              </div>
              <p className="text-2xl font-semibold mb-2">${item.price} USD</p>

              <div className="mb-4 py-5 text-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={20} />
                  <span>Worldwide Shipping</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={20} />
                  <span>Handcrafted with Care</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Gift size={20} />
                  <span>Gift Wrapped</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={20} />
                  <span>Secure Payments</span>
                </div>
              </div>
              <button
                className="mr-4 bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300"
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
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                onClick={handleCheckout}
              >
                Buy
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{item.description}</p>

          {/* ✅ Full-width Images Section */}
          {item.images && item.images.length > 0 && (
            <div className="w-full mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {item.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:5000/${img}`}
                    alt={`extra-${idx}`}
                    className="w-full h-56 object-cover rounded-lg shadow"
                  />
                ))}
              </div>
            </div>
          )}

          {/* ✅ Reviews Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

            {/* Top Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <StarRating value={item.rating || 0} size={28} readOnly />
                <p className="text-gray-700">
                  Based on {item.numReviews} reviews
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="border px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Write a review
              </button>
            </div>

            {/* Reviews List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.length === 0 && <p>No reviews yet</p>}
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="border rounded-lg p-4 shadow-sm bg-gray-50"
                >
                  <p className="font-bold">{r.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                  <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded mt-1">
                    Verified
                  </span>
                  <div className="mt-2">
                    <StarRating value={r.rating} size={20} readOnly />
                  </div>
                  <p className="mt-2 text-gray-700">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* ✅ Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitReview}
      />
    </div>
  );
}
