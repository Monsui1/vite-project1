import React, { useState, useEffect } from "react";
import { updateCart, updateQuantity } from "../store/cartSlise";
import { useDispatch, useSelector } from "react-redux";

export default function ProductCounter({ id }) {
  const cart = useSelector((state) => state.cart.products);
  //console.log("cart", cart);
  const product = cart.find((item) => item.product.id === id);
  //console.log("product", product);

  const [count, setCount] = useState(product ? product.quantity : 0);
  const dispatch = useDispatch();

  useEffect(() => {
    setCount(product ? product.quantity : 0);
  }, [cart, id]);

  function increaseHandler() {
    if (count === 10) return;
    let quantity = count;
    quantity++;

    const products = makeCartCopy(cart);
    const product = products.find((product) => product.product.id === id);

    product.quantity = quantity;
    dispatch(updateQuantity({ products }));
    dispatch(updateCart(products));
  }

  function decreaseHandler() {
    if (count === 0) return;
    let quantity = count;
    quantity--;

    const products = makeCartCopy(cart);
    const product = products.find((product) => product.product.id === id);

    product.quantity = quantity;

    if (quantity === 0) {
      products.splice(products.indexOf(product), 1);
      //console.log(products.indexOf(product));
    }

    dispatch(updateQuantity({ products }));
    dispatch(updateCart(products));
  }

  function makeCartCopy(obj) {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    const copy = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
      copy[key] = makeCartCopy(obj[key]);
    }

    return copy;
  }

  return (
    <div className="counter">
      <button
        disabled={count === 0}
        className="counter__decrease-button counter__button"
        onClick={decreaseHandler}
      >
        –
      </button>
      <div className="conter__count__container">
        <span className="counter__count">{count}</span>
      </div>
      <button
        disabled={count === 10}
        className="counter__increase-button counter__button"
        onClick={increaseHandler}
      >
        +
      </button>
    </div>
  );
}
