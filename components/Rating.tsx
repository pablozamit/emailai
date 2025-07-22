
import React, { useState } from 'react';
import { Icon } from './ui/Icon';

interface RatingProps {
  count?: number;
  value: number;
  onChange: (value: number) => void;
}

export const Rating: React.FC<RatingProps> = ({ count = 5, value, onChange }) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(count)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            type="button"
            key={i}
            onClick={() => onChange(ratingValue)}
            onMouseEnter={() => setHoverValue(ratingValue)}
            onMouseLeave={() => setHoverValue(undefined)}
            className="focus:outline-none"
          >
            <Icon
              name="star"
              className={`w-6 h-6 cursor-pointer transition-colors ${
                (hoverValue || value) >= ratingValue ? 'text-amber-400' : 'text-gray-300'
              }`}
              style={{
                fill: (hoverValue || value) >= ratingValue ? 'currentColor' : 'none',
              }}
            />
          </button>
        );
      })}
    </div>
  );
};
