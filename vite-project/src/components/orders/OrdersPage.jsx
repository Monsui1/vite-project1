import React, { useState, useEffect } from "react";
import "../orders/orders.css";
import "../pagination/pagination.css";
import OrderItem from "./OrderItem";
import { getOrders } from "../../store/ordersSlise";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const location = useLocation();
  const startPage = location.search.split("=")[1] | 0;
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.orders);
  const total = useSelector((state) => state.orders.total);
  const visitedPages = useSelector((state) => state.orders.visitedPages);
  const itemsOnPage = 7;
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!visitedPages.includes(page))
        dispatch(getOrders({ page, itemsOnPage }));
    },
    [dispatch, page],
    visitedPages
  );

  function pageChangeHandler({ selected }) {
    setPage(selected + 1);
    navigate(`?page=${selected + 1}`);
  }

  return (
    <div className="orders__container">
      {total !== 0 ? (
        <div className="orders">
          {orders.length &&
            orders.find((order) => order.page === page) &&
            orders
              .find((order) => order.page === page)
              .data.data.map((order, index) => {
                return (
                  <OrderItem key={index} order={order} orderNumber={index} />
                );
              })}
        </div>
      ) : (
        <p className="orders__empty">Вы еще не сделали ни одного заказа</p>
      )}

      {total > itemsOnPage && (
        <ReactPaginate
          breakLabel="..."
          nextLabel={
            <svg>
              <use href="../images/sprite.svg#icon-arrow-right"></use>
            </svg>
          }
          previousLabel={
            <svg>
              <use href="../images/sprite.svg#icon-arrow-left"></use>
            </svg>
          }
          onPageChange={pageChangeHandler}
          pageRangeDisplayed={1}
          marginPagesDisplayed={2}
          pageCount={Math.ceil(total / itemsOnPage)}
          initialPage={startPage - 1}
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          activeClassName="pagination__item_active"
          breakClassName="pagination__item"
          pageClassName="pagination__item"
          previousClassName="pagination__item"
          nextClassName="pagination__item"
          disabledClassName="pagination__item_disabled"
          activeLinkClassName="pagination-item__link"
          breakLinkClassName="pagination-item__link"
          pageLinkClassName="pagination-item__link"
          previousLinkClassName="pagination-item__link"
          nextLinkClassName="pagination-item__link"
        />
      )}
    </div>
  );
}
