import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import "../productsPage/products.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ProductCounter from "../ProductCounter";
import NotFoundPage from "../NotFoundPage.jsx";
import {
  updateCart,
  addToCart,
  cleanCart,
  cleanStateCart,
  updateQuantity,
} from "../../store/cartSlise.js";
import { submitOrders } from "../../store/ordersSlise.js";
import replaceImage from "../replaceImage";
export default function ProductCardMain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCounterVisible, setIsCounterVisible] = useState(false);
  const [status, setStatus] = useState();
  const id = useParams().id;
  const cart = useSelector((state) => state.cart.products);
  const sum = useSelector((state) => state.cart.sum);
  const [product, setProduct] = useState({
    product: {
      id: id,
      title: "",
      price: "",
      rating: "",
      picture: "",
      description: "",
      category: "",
    },
    quantity: null,
    createdAt: "",
  });

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    let currentProduct = cart.find((product) => product.product.id === id);
    setIsCounterVisible(currentProduct ? currentProduct.quantity : 0);
  }, [cart]);

  async function getProduct() {
    try {
      const data = await fetch(
        `https://skillfactory-task.detmir.team/products/${id}`
      );

      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }
      const response = await data.json();
      const date = String(new Date());

      const NewProduct = {
        product: {
          id: id,
          title: response.title,
          price: response.price,
          rating: response.rating,
          picture: response.picture,
          description: DOMPurify.sanitize(response.description),
          category: response.category,
        },
        quantity: 1,
        createdAt: date,
      };

      setProduct(NewProduct);

      setStatus(true);

      return response;
    } catch {
      setStatus(false);
    }
  }

  function addButtonClickHandler() {
    toggleCounter();
    dispatch(addToCart({ product }));
    const products = [...cart, product];
    dispatch(updateCart(products));
  }

  function orderButtonClickHandler() {
    dispatch(submitOrders(cart));
    toggleCounter();
  }

  function toggleCounter() {
    setIsCounterVisible((prev) => !prev);
  }

  function goBackHandler() {
    navigate(-1);
  }

  return (
    <>
      {status === true ? (
        <>
          <button className="go-back-button" onClick={goBackHandler}>
            <svg>
              <use href="../images/sprite.svg#icon-arrow-left"></use>
            </svg>
            Назад
          </button>
          <section className="product">
            <div className="product__main">
              <div className="product__main__image">
                <img src={product.product.picture} alt={product.product.title} width={250} height={250} onError={replaceImage} />
              </div>
              <div className="product__main__info">
                <h1 className="product__main__info__title">
                  {product.product.title}
                </h1>
                <div className="productcard__info__rating">
                  <div className="stars-empty__container">
                    <svg className="stars_empty">
                      <use href="../images/sprite.svg#stars"></use>
                    </svg>
                  </div>
                  <div
                    className="stars-filled__container"
                    style={{ width: `${product.product.rating * 20}%` }}
                  >
                    <svg className="stars_filled">
                      <use href="../images/sprite.svg#stars"></use>
                    </svg>
                  </div>
                </div>
                <p className="product__main__info__price">
                  {product.product.price} ₽
                </p>
                <div className="product__main__info__buttons">
                  {!isCounterVisible ? (
                    <button
                      className="product__main__info__button button"
                      onClick={addButtonClickHandler}
                    >
                      Добавить в корзину
                    </button>
                  ) : (
                    <>
                      <ProductCounter id={id} />
                      <button
                        className="product__main__info__button button"
                        onClick={orderButtonClickHandler}
                        disabled={sum > 10000}
                      >
                        Оформить заказ
                      </button>
                    </>
                  )}
                </div>
                <div className="product__main__info__return">
                  <svg>
                    <use href="../images/sprite.svg#icon-arrow-return"></use>
                  </svg>
                  <h3>Условия возврата</h3>
                  <p>
                    Обменять или вернуть товар надлежащего качества можно в
                    течение 14 дней с момента покупки.
                  </p>
                </div>
                <p className="product__main__info__note">
                  Цены в интернет-магазине могут отличаться от розничных
                  магазинов.
                </p>
              </div>
            </div>
            <div className="product__description">
              <h2 className="product__description__title">Описание</h2>
              <div
                className="product__description__text"
                dangerouslySetInnerHTML={{
                  __html: product.product.description,
                }}
              ></div>
            </div>
          </section>{" "}
        </>
      ) : status === false ? (
        <NotFoundPage />
      ) : (
        <div>Загрузка...</div>
      )}
    </>
  );
}
