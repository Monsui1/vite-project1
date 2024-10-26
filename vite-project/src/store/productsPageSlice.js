import { createSlice } from "@reduxjs/toolkit";

const productsPageSlice = createSlice({
  name: "productsPage",
  initialState: {
    scroll: null,
  },
  reducers: {
    rememberScroll: (state, action) => {
      state.scroll = action.payload.scrollPosition;
    },
  },
});

export const { rememberScroll } = productsPageSlice.actions;
export default productsPageSlice.reducer;

//Описание работы
//Данный код создает срез состояния, который управляет положением прокрутки на странице продуктов. 
//Когда пользователь перемещается по странице, и требуется запомнить его положение прокрутки, вы можете вызывать действие rememberScroll с нужным значением. 
//Это действие обновит состояние scroll в Redux, что позволит в дальнейшем использовать эту информацию, например, для возвращения пользователя к тому же месту на странице.