import { useState, useEffect } from "react";
import { useFetchProducts } from "../Product/Product";
import { Shift } from "../PageShift/PageShift";
import CustomDropdown from "./CustomDropdown";
import "./Sell.css";

export function SellList() {
  const [sortOrder, setSortOrder] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(getPageSize(window.innerWidth));

  function getPageSize(width) {
    if (width < 375) return 4; // Mobile
    if (width < 1199) return 6; // Tablet
    return 10; // Desktop
  }

  useEffect(() => {
    function handleResize() {
      setPageSize(getPageSize(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { products, loading, totalPages } = useFetchProducts({
    orderBy: sortOrder,
    page: currentPage,
    pageSize: pageSize,
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1); // 정렬 기준 변경 시 페이지를 1로 초기화
  };

  return (
    <>
      <div className="searchBar">
        <p className="fontStyle">판매 중인 상품</p>
        <input
          className="inputSearch"
          type="text"
          placeholder="검색할 상품을 입력해주세요"
        />
        <button className="btnSearch">상품 등록하기</button>
        <CustomDropdown
          selectedOption={sortOrder}
          onOptionChange={handleSortChange}
        />
      </div>

      <div className="sell">
        <div className="sellProductList">
          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>No products available</p>
          ) : (
            products.map((item) => (
              <div key={item.id} className="sellProductItem">
                <img
                  className="sellProduct"
                  src={item.images[0] || "No image"}
                  alt={item.name || "Product image"}
                />
                <p className="itemName">{item.name || "No name"}</p>
                <p className="itemPrice">
                  {item.price ? `${formatPrice(item.price)} 원` : "No price"}
                </p>
                <p className="itemFavoriteCnt">
                  ♡ {item.favoriteCount || "No likes"}
                </p>
              </div>
            ))
          )}
        </div>
        <Shift
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
