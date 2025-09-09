// ItemPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import StarRating from "../StarRating/StarRating";
import ReviewModal from "../ReviewModal/ReviewModal";

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

  const submitReview = async (rating: number, comment: string) => {
    try {
      await axios.post(
        `http://localhost:5000/api/items/${id}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const res = await axios.get(
        `http://localhost:5000/api/items/${id}/reviews`
      );
      setReviews(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4 bg-gray-100 text-black">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {/* Grid layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Images */}
            <div>
              {item.coverImage && (
                <img
                  src={`http://localhost:5000/${item.coverImage}`}
                  alt={item.title}
                  className="w-full h-80 object-cover rounded-lg shadow mb-4"
                />
              )}
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
              <p
                className="font-bold flex items-center cursor-pointer"
                onClick={() => setIsModalOpen(true)} // ⭐ click stars -> open modal
              >
                <StarRating value={item.rating || 0} size={28} />
                <span className="ml-2">({item.numReviews} reviews)</span>
              </p>

              <p className="text-gray-600 mb-6">{item.description}</p>
              <p className="text-2xl font-bold mb-6">${item.price}</p>
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
                Buy
              </button>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

            {/* Button with hover trigger */}
            <div
              onMouseEnter={() => setIsModalOpen(true)} // 👈 open on hover
              onMouseLeave={() => setIsModalOpen(false)} // 👈 close when leave
              className="inline-block"
            >
              <button className="mb-4 px-4 py-2 bg-black text-white rounded">
                Write a Review
              </button>
            </div>

            {reviews.length === 0 && <p>No reviews yet</p>}
            {reviews.map((r) => (
              <div key={r._id} className="border-b py-3">
                <p className="font-bold flex items-center">
                  {r.user.name}
                  <span className="ml-2">
                    <StarRating value={r.rating} size={20} />
                  </span>
                </p>
                <p>{r.comment}</p>
                <p className="text-sm text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
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
