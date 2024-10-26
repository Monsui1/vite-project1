import React from "react";

export default function OrdersPopup({ choiseHandler }) {
  function addHandler() {
    choiseHandler("add");
  }

  function replaceHandler() {
    choiseHandler("replace");
  }

  function closePopupHandler() {
    choiseHandler("close");
  }

  return (
    <div className="orders__popup">
      <p className="orders-popup__title">В корзине уже есть товары</p>
      <div className="orders-popup__buttons">
        <button className="button" onClick={addHandler}>
          Добавить
        </button>
        <button className="button" onClick={replaceHandler}>
          Заменить
        </button>
        <button
          className="button orders-popup__button-cancel"
          onClick={closePopupHandler}
          title="Галя, у нас отмена!"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
