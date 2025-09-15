import React, { useState } from "react";
import StarRating from "../StarRating/StarRating";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  onReviewSubmitted?: () => void; // optional callback after successful review
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  itemId,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit a review");
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating.toString());
    formData.append("comment", comment);
    images.forEach((img) => formData.append("reviewImages", img));

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/items/${itemId}/reviews`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      alert("Review submitted successfully!");
      setRating(0);
      setComment("");
      setImages([]);
      setPreviewUrls([]);
      onClose();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err: any) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl text-black font-bold mb-4 text-center">
          Write a Review
        </h2>

        {/* Star rating */}
        <StarRating value={rating} onChange={setRating} size={32} />

        {/* Comment */}
        <textarea
          className="w-full border rounded p-2 mt-4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
        />

        {/* Image upload */}
        <div className="mt-4">
          <label className="block font-semibold mb-2">Add Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx + 1}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
