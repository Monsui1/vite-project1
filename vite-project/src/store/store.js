//Здесь вы импортируете функцию configureStore из библиотеки Redux Toolkit. Эта функция упрощает настройку хранилища Redux, предоставляя готовые параметры и улучшая настройки по умолчанию.

import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../store/productsSlise";
import productsPageReducer from "../store/productsPageSlice";
import cartSlise from "./cartSlise";
import ordersSlise from "./ordersSlise";

export default configureStore({
  reducer: {
    products: productsReducer,
    productsPage: productsPageReducer,
    cart: cartSlise,
    orders: ordersSlise,
  },
});

//Описание работы
//Этот код создает хранилище Redux, которое объединяет различные куски состояния (slices) в одном объекте. 
//Это позволяет вам управлять состоянием приложения более организованно и модульно. 
//Каждый редюсер отвечает за свою часть состояния, а хранилище объединяет их для удобного доступа и управления.