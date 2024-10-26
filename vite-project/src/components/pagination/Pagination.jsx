import React from "react";
import "../pagination/pagination.css";

//import { Link } from "react-router-dom";

export default function Pagination({ pages, current, switchPage }) {
  console.log("total", pages);
  const pagesArray = Array.from({ length: pages }, (_, i) => i + 1);

  function nextPageHandler() {
    switchPage(current + 1);
  }
  function prevPageHandler() {
    switchPage(current - 1);
  }

  return (
    <div className="pagination">
      <button
        className="pagination__prev pagination__item"
        disabled={current === 1}
        onClick={prevPageHandler}
      >
        <svg>
          <use href="../images/sprite.svg#icon-arrow-left"></use>
        </svg>
      </button>
      {pages < 6 ? (
        <>
          {pagesArray.map((page) => (
            <button
              onClick={() => {
                switchPage(page);
              }}
              key={page}
              className={`pagination__item${
                page === current ? " pagination__item_active" : ""
              }`}
            >
              {page}
            </button>
          ))}
        </>
      ) : null}
      <button
        className="pagination__next pagination__item"
        onClick={nextPageHandler}
        disabled={current === pagesArray[pages - 1]}
      >
        <svg>
          <use href="../images/sprite.svg#icon-arrow-right"></use>
        </svg>
      </button>
    </div>
  );
}
