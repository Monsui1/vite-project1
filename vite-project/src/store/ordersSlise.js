import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cleanCart, cleanStateCart } from "./cartSlise";

// Асинхронные действия 
// getOrders - Получает заказы с сервера, отправляя запрос на определённую страницу с указанным количеством элементов на странице.
// Если запрос успешный (ответ с сервера имеет статус 200), вызываются следующие действия:
// stateOrders: сохраняет заказы в состоянии Redux.
// rememberPage: сохраняет страницу, которую посетил пользователь, чтобы избежать повторных запросов.
// Если запрос не удаётся, ловит и выводит ошибку в консоль. 

export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async ({ page, itemsOnPage }, { dispatch }) => {
    //console.log("get orders");
    try {
      const response = await fetch(
        `https://skillfactory-task.detmir.team/orders?page=${page}&limit=${itemsOnPage}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        // console.log("data 2", data);
        dispatch(stateOrders({ data, page }));
        dispatch(rememberPage({ page }));
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// submitOrders:
// Отправляет запрос на сервер для оформления заказа (метод POST).
// Если запрос успешный (заказ успешно оформлен), выполняются следующие действия:
// cleanStateCart: очищает состояние корзины.
// cleanCart: очищает данные корзины (предположительно в другом срезе состояния).
// cleanOrdersState: очищает состояние заказов.

export const submitOrders = createAsyncThunk(
  "orders/submitOrders",
  async (_, { dispatch }) => {
    //console.log("submit orders", cart);
    try {
      const response = await fetch(
        `https://skillfactory-task.detmir.team/cart/submit`,
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      if (response.ok) {
        dispatch(cleanStateCart());
        console.log("CLEAN");
        dispatch(cleanCart());
        dispatch(cleanOrdersState());
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// Slice (срез состояния):
// Определён срез состояния для заказов с именем "orders". Этот срез имеет следующие поля:
// orders: массив, в который сохраняются заказы.
// total: общее количество заказов (по умолчанию 1).
// visitedPages: массив страниц, которые уже были загружены, чтобы избежать повторной загрузки.

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    total: 1,
    visitedPages: [],
  },

// Reducers (Редюсеры):
// stateOrders: добавляет новые данные с заказами в массив orders и обновляет общее количество заказов из мета-информации ответа (в поле meta.total).
// rememberPage: добавляет номер страницы в массив visitedPages, если эта страница ещё не была загружена.
// cleanOrdersState: очищает состояние заказов, сбрасывая массив заказов, общее количество и список посещённых страниц.

  reducers: {
    stateOrders: (state, action) => {
      state.orders.push(action.payload);
      state.total = action.payload.data.meta.total;
    },
    rememberPage: (state, action) => {
      if (!state.visitedPages.includes(action.payload.page)) {
        state.visitedPages.push(action.payload.page);
      }
    },
    cleanOrdersState: (state, action) => {
      state.orders = [];
      state.total = 1;
      state.visitedPages = [];
    },
  },
});

const { stateOrders, rememberPage, cleanOrdersState } = orderSlice.actions;
export default orderSlice.reducer;

// Основная цель кода:
// Управление состоянием заказов в приложении, включая получение списка заказов с сервера (с разбиением на страницы), отправку заказа на сервер, а также очистку информации о заказах и корзине после оформления заказа.
// Пример использования:
// Когда пользователь заходит на страницу заказов, отправляется запрос через getOrders для загрузки данных. Эти данные сохраняются в Redux.
// Когда пользователь завершает покупку, вызывается submitOrders, который отправляет заказ на сервер и очищает данные корзины и заказов в состоянии.
// Этот код помогает организовать логику взаимодействия с сервером и упрощает управление асинхронными действиями и состоянием в приложении на основе Redux.
