import React from "react";
import "../index.css";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <p className="not-found__title">Такого товара не существует :\</p>
      <Link to="/">
        <svg>
          <use href="./images/sprite.svg#icon-arrow-left"></use>
        </svg>
        Вернуться к списку товаров
      </Link>
    </div>
  );
}
