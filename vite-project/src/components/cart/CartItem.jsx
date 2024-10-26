import React from "react";
import { useSelector } from "react-redux";
import ProductCounter from "../ProductCounter";
import replaceImage from "../replaceImage";
export default function CartItem({ id }) {
  const cart = useSelector((state) => state.cart.products);
  const product = cart.find((item) => item.product.id === id);

  return (
    <div className="cart__item">
      <div className="cart__item__image">
        <img src={product.product.picture} alt={product.product.title} onError={replaceImage}/>
      </div>
      <p className="cart__item__name">{product.product.title}</p>
      <div className="cart__item__counter">
        <ProductCounter id={id} />
      </div>
      <div className="cart__item__price__container">
        {product.quantity > 1 && (
          <p className="cart__item__price_piece">
            {product.product.price} ₽ за шт.
          </p>
        )}
        <p className="cart__item__price_main">
          {product.product.price * product.quantity} ₽
        </p>
      </div>
    </div>
  );
}
