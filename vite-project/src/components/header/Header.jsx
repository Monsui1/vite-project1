import React, { useState, useEffect } from "react";
import "../header/header.css";
import { NavLink, Link } from "react-router-dom";
import Cart from "../cart/Cart";
import { useSelector } from "react-redux";

function setActive({ isActive }) {
  if (isActive)
    return "header__navigation__link header__navigation__link_active";
  else return "header__navigation__link";
}

export default function Header() {
  const cart = useSelector((state) => state.cart.products);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const windowWidth = document.documentElement.clientWidth;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [burgerClassName, setBurgerClassName] = useState("header__burger");

  useEffect(() => {
    if (isCartVisible) {
      const listener = (e) => {
        if (!e.target.classList[0]) return;
        if (
          e.target.classList[0].includes("cart") ||
          e.target.classList[0].includes("counter")
        )
          return;
        else {
          setIsCartVisible(false);
        }
      };
      document.addEventListener("click", listener);

      return () => {
        document.removeEventListener("click", listener);
      };
    }
  }, [isCartVisible]);

  function toggleCartHandler() {
    setIsCartVisible((prev) => !prev);
  }

  function showMenuHandler(e) {
    e.preventDefault();
    if (isMenuVisible === false) {
      setIsMenuVisible(true);
      setBurgerClassName("header__burger_active");
    } else {
      setIsMenuVisible(false);
      setBurgerClassName("header__burger");
    }
  }

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (!e.target.classList.value.includes("header__burger")) {
        setIsMenuVisible(false);
        setBurgerClassName("header__burger");
      }
    });
    return () => {
      document.removeEventListener("click", (e) => {
        if (!e.target.classList.value.includes("header__burger")) {
          setIsMenuVisible(false);
          setBurgerClassName("header__burger");
        }
      });
    };
  }, []);

  return (
    <header className="header">
      <div className="header__container">
        {windowWidth > 605 ? (
          <>
            {isCartVisible && <Cart />}
            <div className="header__logo">
              <Link to="/">
                <img src="./images/Logo.svg" alt="" />
              </Link>
            </div>
            <nav className="header__navigation">
              <NavLink to="/" className={setActive}>
                Товары
              </NavLink>
              <NavLink to="/orders?page=1" className={setActive}>
                Заказы
              </NavLink>
            </nav>
            <button className="header__cart" onClick={toggleCartHandler}>
              <svg>
                <use href="./images/sprite.svg#icon-cart"></use>
              </svg>
              Корзина
              {cart.length !== 0 && <span>({cart.length})</span>}
            </button>
          </>
        ) : (
          <>
            {!isMenuVisible ? (
              <div className="header__logo">
                <Link to="/">
                  <img src="./images/Logo.svg" alt="" />
                </Link>
              </div>
            ) : (
              <div className="header__mobile-menu">
                <NavLink to="/" className={setActive}>
                  Товары
                </NavLink>
                <NavLink to="/orders?page=1" className={setActive}>
                  Заказы
                </NavLink>
                <NavLink to="/cart" className={setActive}>
                  <svg className="cart-icon">
                    <use href="./images/sprite.svg#icon-cart"></use>
                  </svg>
                  Корзина
                  {cart.length !== 0 && <span>({cart.length})</span>}
                </NavLink>
              </div>
            )}

            <button className={burgerClassName} onClick={showMenuHandler}>
              <span className="burger__top burger__item"></span>
              <span className="burger__middle burger__item"></span>
              <span className="burger__bottom burger__item"></span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
