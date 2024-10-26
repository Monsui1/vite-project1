import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCart, updateQuantity } from "../../store/cartSlise";
import OrdersPopup from "./OrdersPopup";
import { Link } from "react-router-dom";
import replaceImage from "../replaceImage";
function formateDate(date) {
  const months = {
    "01": "января",
    "02": "февраля",
    "03": "марта",
    "04": "апреля",
    "05": "мая",
    "06": "июня",
    "07": "июля",
    "08": "августа",
    "09": "сентября",
    10: "октября",
    11: "ноября",
    12: "декабря",
  };

  const [year, month, day] = date.split("T")[0].split("-");
  return `${day} ${months[month]} ${year} г`;
}

export default function OrderItem({ order, orderNumber }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.products);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const productsId = cart.map((item) => item.product.id);
  const imagesContainerRef = useRef();

  function reorderHandler() {
    if (cart.length === 0) {
      dispatch(updateCart(order));
      console.log(order);
    } else {
      setIsPopupVisible(true);
    }
  }

  function onChoiseHandler(choise) {
    if (choise === "add") {
      const cartCopy = makeCartCopy(cart);
      order.forEach((orderProduct) => {
        if (productsId.includes(orderProduct.product.id)) {
          cartCopy.find(
            (item) => item.product.id === orderProduct.product.id
          ).quantity += orderProduct.quantity;
          console.log(cartCopy);
        } else {
          cartCopy.push(orderProduct);
          console.log(cartCopy);
        }
      });

      const products = cartCopy;
      dispatch(updateQuantity({ products }));
      dispatch(updateCart(products));
      setIsPopupVisible(false);
    } else if (choise === "replace") {
      const products = order;
      dispatch(updateQuantity({ products }));
      dispatch(updateCart(products));
      setIsPopupVisible(false);
    } else setIsPopupVisible(false);
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

  useEffect(() => {
    const imagesContainer = imagesContainerRef.current;

    const handleWheel = (event) => {
      event.preventDefault();
      const delta = Math.sign(event.deltaY);
      imagesContainer.scrollLeft += delta * 35;
    };

    imagesContainer.addEventListener("wheel", handleWheel);

    return () => {
      imagesContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  function showDetailsHandler() {
    if (isDetailsVisible) {
      setIsDetailsVisible(false);
    } else {
      setIsDetailsVisible(true);
    }
  }

  return (
    <div className="orders__item">
      {isPopupVisible && <OrdersPopup choiseHandler={onChoiseHandler} />}
      <div className="order-item__title-container">
        <p className="order-item__title">Заказ</p>
        <p className="order-item__order-number">№ {orderNumber}</p>
      </div>
      <div className="order-item__images" ref={imagesContainerRef}>
        {order.map((item) => {
          return (
            <img
              key={item.product.id}
              src={item.product.picture}
              alt={item.product.title}
              className="order-item__image"
              onError={replaceImage}
            />
          );
        })}
      </div>
      <div className="order-item__info">
        <p className="order-item-info__date-title">Оформлено</p>
        <p className="order-item-info__date">
          {formateDate(order[0].createdAt)}
        </p>
        <p className="order-item-info__sum-title">На сумму</p>
        <p className="order-item-info__sum">
          {order.reduce((sum, item) => {
            return sum + item.product.price;
          }, 0)}{" "}
          ₽
        </p>
        <button
          className="order-item__reorder-button button"
          onClick={reorderHandler}
        >
          Повторить заказ
        </button>
        <button
          className="order-item__detail-button button"
          onClick={showDetailsHandler}
        >
          Детали заказa
        </button>
      </div>
      {isDetailsVisible && (
        <div className="order-item__details">
          {order.map((item) => {
            return (
              <Link
                to={`/${item.product.id}`}
                key={item.product.id}
                className="details__item"
              >
                <div className="details-item__image">
                  <img src={item.product.picture} alt={item.product.title} />
                </div>

                <p className="details-item__title">{item.product.title}</p>
                <p className="details-item__price">{item.product.price} ₽</p>
                <p className="details-item__quantity">{item.quantity} шт</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
