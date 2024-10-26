import React from "react";
import "../productsPage/products.css";
import { Link } from "react-router-dom";
import replaceImage from "../replaceImage";

export default function ProductCard({ id, name, price, image, rating }) {

  return (
    <Link to={id}>
      <div className="products__productcard">
        <div className="productcard__image">
          <img src={image} alt={name} width={250} height={250} onError={replaceImage}/>
        </div>
        <div className="productcard__info">
          <p className="productcard__info__name" title={name}>
            {name}
          </p>
          <div className="productcard__info__rating">
            <div className="stars-empty__container">
              <svg className="stars_empty stars-icon">
                <use href="./images/sprite.svg#stars"></use>
              </svg>
            </div>
            <div
              className="stars-filled__container"
              style={{ width: `${rating * 20}%` }}
            >
              <svg className="stars_filled stars-icon">
                <use href="./images/sprite.svg#stars"></use>
              </svg>
            </div>
          </div>
          <p className="productcard__info__price">{price} ₽</p>
        </div>
      </div>
    </Link>
  );
}
