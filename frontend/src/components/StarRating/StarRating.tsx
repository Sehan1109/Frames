import React, { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

const StarRating = ({ value, onChange, size = 24 }: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          xmlns="http://www.w3.org/2000/svg"
          fill={(hover || value) >= star ? "gold" : "gray"}
          viewBox="0 0 24 24"
          stroke="none"
          className="cursor-pointer transition"
          style={{ width: size, height: size }}
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.898 1.48 8.271L12 18.896l-7.416 4.579 1.48-8.271-6.064-5.898 8.332-1.151z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
