import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// getCart:
// Отправляет запрос на сервер для получения текущего состояния корзины.
// Если запрос успешен, данные корзины возвращаются в состояние Redux.
// Если запрос завершается ошибкой, ошибка выводится в консоль.

export const getCart = createAsyncThunk("cart/getCart", async () => {
  //console.log("get cart");
  try {
    const response = await fetch(`https://skillfactory-task.detmir.team/cart`, {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
});

// updateCart:
// Отправляет на сервер обновлённые данные о продуктах в корзине.
// Сервер принимает массив продуктов с их ID и количеством.
// Если обновление успешно, состояние корзины в Redux обновляется с новыми данными через редюсер updateStateCart.
// Если обновление не удалось (сервер вернул ошибку), последний продукт удаляется из корзины (с помощью метода pop), и состояние снова обновляется.

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (products, { dispatch }) => {
    try {
      const response = await fetch(
        `https://skillfactory-task.detmir.team/cart/update`,
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: products.map((item) => {
              return {
                id: item.product.id,
                quantity: item.quantity,
              };
            }),
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        dispatch(updateStateCart({ products }));
        //console.log("updated cart", data);
      } else {
        products.pop();
        dispatch(updateStateCart({ products }));
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// cleanCart:
// Отправляет запрос на сервер для очистки корзины (передаётся пустой массив продуктов).
// После успешного ответа от сервера, корзина очищается.

export const cleanCart = createAsyncThunk("cart/cleanCart", async () => {
  try {
    const response = await fetch(
      `https://skillfactory-task.detmir.team/cart/update`,
      {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [],
        }),
      }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
});

// Slice (срез состояния):
// Определён срез состояния для корзины с именем "cart". Этот срез содержит следующее начальное состояние:
// products: массив продуктов в корзине.
// sum: общая сумма товаров в корзине (по умолчанию 1).

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    sum: 1,
  },

// Reducers (Редюсеры):
// updateStateCart: обновляет массив продуктов в корзине с новыми данными.
// addToCart: добавляет новый продукт в корзину и увеличивает общую сумму на цену этого продукта.
// updateQuantity: обновляет количество продуктов в корзине и пересчитывает общую сумму на основе их цены и количества.
// cleanStateCart: очищает корзину, сбрасывая массив продуктов и общую сумму.

  reducers: {
    updateStateCart: (state, action) => {
      state.products = action.payload.products;
    },
    addToCart: (state, action) => {
      state.products.push(action.payload.product);
      state.sum += action.payload.product.product.price;
    },
    updateQuantity: (state, action) => {
      state.products = action.payload.products;
      state.sum = action.payload.products.reduce((sum, item) => {
        const price = item.price || item.product.price;
        const quantity = item.quantity || item.product.quantity;
        return sum + price * quantity;
      }, 1);
    },
    cleanStateCart: (state) => {
      state.products = [];
      state.sum = 1;
    },
  },

// extraReducers:
// Используется для обработки успешного выполнения асинхронного действия getCart. Когда корзина успешно загружена с сервера,:
// Состояние продуктов обновляется данными, полученными от сервера.
// Общая сумма пересчитывается на основе цены и количества каждого товара в корзине.

  extraReducers: (builder) => {
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.products = action.payload;
      state.sum = action.payload.reduce((sum, item) => {
        const price = item.price || item.product.price;
        const quantity = item.quantity || item.product.quantity;
        return sum + price * quantity;
      }, 0);
    });
  },
});

//Экспортируемые действия и редюсер:
//Экспортируются действия для управления состоянием корзины: updateStateCart, addToCart, cleanStateCart, updateQuantity.
//Экспортируется редюсер cartSlice.reducer, который будет зарегистрирован в хранилище Redux для управления состоянием корзины.

export const { updateStateCart, addToCart, cleanStateCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;

//Основная цель кода:
//Этот код управляет состоянием корзины в приложении, позволяя получать данные корзины с сервера, добавлять товары в корзину, обновлять количество товаров, очищать корзину, а также синхронизировать изменения корзины с сервером.
//Пример использования:
//Когда пользователь открывает страницу корзины, отправляется запрос через getCart для загрузки текущего состояния корзины с сервера.
//Когда пользователь добавляет новый товар в корзину, вызывается addToCart, чтобы обновить состояние корзины и пересчитать общую сумму.
//Если пользователь изменяет количество товаров в корзине, вызывается updateCart для синхронизации этого изменения с сервером.
//При очистке корзины вызывается cleanCart, чтобы очистить данные как на сервере, так и в локальном состоянии.
//Важные моменты:
//Асинхронные действия отправляют HTTP-запросы на сервер и ожидают ответа, чтобы обновить состояние корзины.
//Важное внимание уделено пересчёту общей суммы продуктов в корзине при каждом изменении состояния корзины.
//Код использует credentials: "include", что указывает на использование куки или других методов аутентификации с сервером.
