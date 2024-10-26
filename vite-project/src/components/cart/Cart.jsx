import React from "react";
import "../cart/cart.css";
import CartItem from "./CartItem";
import { useSelector, useDispatch } from "react-redux";
import { submitOrders } from "../../store/ordersSlise";

export default function Cart() {
  const dispatch = useDispatch();
  const sum = useSelector((state) => state.cart.sum);
  const cart = useSelector((state) => state.cart.products);

  return (
    <section className="cart">
      {sum > 0 ? (
        <>
          {cart.map((item) => {
            return (
              <CartItem
                key={item.id || item.product.id}
                id={item.id || item.product.id}
              />
            );
          })}

          <div className="cart__info">
            <p className="cart__info__title">Итого</p>
            <p className="cart__info__price">
              {cart.reduce((sum, item) => {
                const price = item.price || item.product.price;
                const quantity = item.quantity || item.product.quantity;
                return sum + price * quantity;
              }, 0)}{" "}
              ₽
            </p>
          </div>
          <button
            className="cart__button button"
            disabled={sum > 15000}
            onClick={() => {
              dispatch(submitOrders(cart));
            }}
          >
            Оформить заказ
          </button>
        </>
      ) : (
        <p className="cart__title">Корзина пуста</p>
      )}
    </section>
  );
}
