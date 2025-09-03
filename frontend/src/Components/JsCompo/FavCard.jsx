// frontend/src/Components/JsCompo/FavCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function FavCard({ imageURL, category }) {
  return (
    <Link to={`/event?category=${encodeURIComponent(category)}`}>
      <div className="px-4 py-2 hover:scale-[101%] cursor-pointer">
        <img
          className="rounded-3xl h-auto w-fit max-w-[230px] max-h-[350px] object-cover object-center"
          src={imageURL}
          alt={category}
        />
      </div>
    </Link>
  );
}

export default FavCard;
