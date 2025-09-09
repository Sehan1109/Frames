import React, { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

const StarRating = ({
  value,
  onChange,
  size = 24,
  readOnly = false,
}: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || value);
        return (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={filled ? "gold" : "gray"}
            width={size}
            height={size}
            className={readOnly ? "cursor-default" : "cursor-pointer"}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(star)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.2 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.125 2.27a1 1 0 00-.364 1.118l1.2 3.674c.3.921-.755 1.688-1.54 1.118l-3.125-2.27a1 1 0 00-1.176 0l-3.125 2.27c-.784.57-1.838-.197-1.539-1.118l1.2-3.674a1 1 0 00-.364-1.118L2.45 9.101c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.2-3.674z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
