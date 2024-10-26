//Здесь мы импортируем функцию createSlice из библиотеки Redux Toolkit. Она упрощает создание Redux-срезов, которые включают как состояние, так и редюсеры.

import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    pageNumber: 1,
    fetching: true,
    totalProducts: 0,
  },
  reducers: {
    addProducts: (state, action) => {
      state.products = action.payload.newProducts;
      state.pageNumber = action.payload.newPageNumber;
      state.fetching = action.payload.newFetching;
      state.totalProducts = action.payload.newTotalProducts;
    },
  },
});

export const { addProducts } = productsSlice.actions;
export default productsSlice.reducer;

//Описание работы
//Этот код создает срез состояния, который управляет состоянием списка продуктов в приложении. Состояние включает в себя:

//Массив продуктов, который будет заполняться данными.
//Номер страницы, что полезно для пагинации.
//Статус загрузки, который позволяет знать, когда данные загружаются.
//Общее количество продуктов для отображения информации о количестве доступных элементов.
//Редюсер addProducts позволяет обновлять все эти поля состояния одновременно, что удобно при получении новых данных о продуктах из API или другого источника.
