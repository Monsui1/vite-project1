import React, { useEffect, useState, useRef } from "react";
import "../productsPage/products.css";
import ProductCard from "../productCard/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { addProducts } from "../../store/productsSlise";
import { rememberScroll } from "../../store/productsPageSlice";
//import {useGetProducts} from "../../functions/getProducts";

export default function ProductsPage() {
  const allProducts = useSelector((state) => state.products.products);
  const pageNumber = useSelector((state) => state.products.pageNumber);
  const stateFetching = useSelector((state) => state.products.fetching);
  const stateTotalProducts = useSelector(
    (state) => state.products.totalProducts
  );
  const scrollPosition = useSelector((state) => state.productsPage.scroll);
  const isFirstRender = useRef(true);

  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(stateFetching);
  const [totalProducts, setTotalProducts] = useState(stateTotalProducts);

  useEffect(() => {
    if (fetching) getProducts();
  }, [fetching]);

  async function getProducts() {
    try {
      const data = await fetch(
        `https://skillfactory-task.detmir.team/products?limit=15&page=${pageNumber}`
      );
      const response = await data.json();

      //setProducts([...products, ...response.data]);
      //setCurrentPage((prev) => prev + 1);
      setTotalProducts(response.meta.count);

      dispatch(
        addProducts({
          newProducts: [...allProducts, ...response.data],
          newPageNumber: pageNumber + 1,
          newFetching: false,
          newTotalProducts: response.meta.count,
        })
      );

      return response;
    } catch {
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);

    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [totalProducts]);

  function scrollHandler(e) {
    dispatch(rememberScroll({ scrollPosition: window.scrollY }));
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
        100 &&
      totalProducts > 0
    ) {
      setFetching(true);
    }
  }

  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, []);

  return (
    <div className="products">
      {allProducts.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.title}
          price={product.price}
          rating={product.rating}
          image={product.picture}
        ></ProductCard>
      ))}
    </div>
  );
}
