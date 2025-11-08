import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import StarRating from "../StarRating/StarRating";
import ReviewModal from "../ReviewModal/ReviewModal";
import { Globe, CheckCircle, Gift, Lock } from "lucide-react";
import { useCart } from "../Context/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE as string;
// Get PayHere Merchant ID and App URL from .env
const PAYHERE_MERCHANT_ID = import.meta.env.VITE_PAYHERE_MERCHANT_ID;
const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";
const PAYHERE_URL = "https://sandbox.payhere.lk/pay/checkout"; // Use sandbox for testing

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
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState<string | null>(null);

  // === NEW PAYHERE SUBMIT LOGIC ===
  const handleOrderSubmit = async (orderData: {
    name: string;
    address: string;
    whatsapp: string;
    quantity: number;
  }) => {
    if (!item) return;

    // Step 1: Create the 'pending' order in our database
    let newOrder;
    try {
      const res = await axios.post<{
        order: { _id: string; totalAmount: number };
      }>(
        `${API_BASE}/orders`,
        {
          productId: item._id,
          ...orderData,
          price: item.price * orderData.quantity,
          // Note: The 'status' defaults to 'pending' in your Order.js model
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Ensure the backend returns the created order object
      if (!res.data || !res.data.order || !res.data.order._id) {
        throw new Error("Order was created but no order data was returned.");
      }
      newOrder = res.data.order;
    } catch (err) {
      console.error("Failed to create pending order", err);
      alert("Failed to create order ❌. Please try again.");
      return; // Stop if we can't create the pending order
    }

    // Step 2: Get PayHere hash for the *newly created order*
    const order_id = newOrder._id; // This is the unique ID from our DB
    const amount = newOrder.totalAmount;
    const currency = "LKR"; // PayHere primarily uses LKR

    let hash;
    try {
      interface HashResponse {
        hash: string;
      }
      const hashRes = await axios.post<HashResponse>(
        `${API_BASE}/payments/payhere/generate-hash`,
        {
          order_id,
          amount,
          currency,
        }
      );
      hash = hashRes.data.hash;
    } catch (err) {
      console.error("Failed to get PayHere hash", err);
      alert("Failed to connect to payment gateway. Please try again.");
      // You might want to delete the pending order here, or run a cleanup job later
      return;
    }

    // Step 3: Dynamically create and submit the PayHere form
    console.log("Redirecting to PayHere...");
    const payhereForm = document.createElement("form");
    payhereForm.method = "POST";
    payhereForm.action = PAYHERE_URL;
    payhereForm.style.display = "none"; // Hide the form

    // All fields required by PayHere
    const inputs = {
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: `${APP_URL}/success?order_id=${order_id}`, // We'll create this page
      cancel_url: `${APP_URL}/cancel`, // We'll create this page
      notify_url: `${API_BASE}/payments/payhere/notify`,
      order_id,
      items: item.title,
      amount: amount.toFixed(2),
      currency,
      first_name: orderData.name,
      last_name: "", // Required, can be empty
      email: "user@example.com", // Get from user profile or use a placeholder
      phone: orderData.whatsapp,
      address: orderData.address,
      city: "Colombo", // You should get this from the user
      country: "Sri Lanka",
      hash,
    };

    // Add inputs to form
    for (const [key, value] of Object.entries(inputs)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value as string;
      payhereForm.appendChild(input);
    }

    // Add form to DOM, submit it, and then remove it
    document.body.appendChild(payhereForm);
    payhereForm.submit();
    document.body.removeChild(payhereForm);
  };
  // === END OF NEW LOGIC ===

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

      <main className="flex-1 py-32 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12">
          {/* Responsive Grid (Unchanged) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Images (Unchanged) */}
            <div className="flex flex-col items-center">
              {mainImage && (
                <img
                  src={mainImage}
                  alt={item.title}
                  className="w-full max-w-md h-96 object-cover rounded-xl shadow-md mb-4 transition-transform hover:scale-105 text-black"
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

            {/* Right: Details (Unchanged) */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-extrabold mb-4 text-black">
                  {item.title}
                </h1>
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
                  onClick={() => {
                    addToCart({
                      _id: item._id,
                      title: item.title,
                      price: item.price,
                      coverImage: item.coverImage,
                      quantity: 1,
                    });
                    navigate("/cart");
                  }}
                >
                  Order
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section (Unchanged) */}
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

          {/* --- MODIFIED SECTION --- */}
          {/* This section now displays all images in a simple grid */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              All Item Images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Display Cover Image */}
              {item.coverImage && (
                <img
                  src={`${API_BASE.replace("/api", "")}/uploads/${
                    item.coverImage
                  }`}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-xl shadow-md transition-transform hover:scale-105"
                />
              )}
              {/* Display all other images */}
              {item.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={`${API_BASE.replace("/api", "")}/uploads/${img}`}
                  alt={`gallery-thumb-${idx}`}
                  className="w-full h-48 object-cover rounded-xl shadow-md transition-transform hover:scale-105"
                />
              ))}
            </div>
          </div>
          {/* --- END OF MODIFIED SECTION --- */}
        </div>
      </main>

      <Footer />

      {/* Review Modal (Unchanged) */}
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
