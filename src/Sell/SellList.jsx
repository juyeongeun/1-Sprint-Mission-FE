import React, { useState, useEffect } from "react";
import { useFetchProducts } from "../common/useFetchProducts";
import Pagination from "../Pagination/Pagination";
import { formatPrice } from "../common/Util";
import { useDeviceType } from "../common/useDeviceType";
import { DesktopSearchBar } from "./DesktopSearchBar";
import { MobileSearchBar } from "./MobileSearchBar";
import "./SellList.css";
import default_img from "../image/img_default.svg";

export function SellList() {
  const [sortOrder, setSortOrder] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const deviceType = useDeviceType();

  const pageSize =
    deviceType === "mobile" ? 4 : deviceType === "tablet" ? 6 : 10;

  const { products, totalPages } = useFetchProducts({
    pageSize: pageSize,
    page: currentPage,
    keyword: searchKeyword,
  });

  useEffect(() => {
    const handleResize = () => {
      const firstProductIndex = (currentPage - 1) * pageSize;
      const newPageSize =
        deviceType === "mobile" ? 4 : deviceType === "tablet" ? 6 : 10;
      const newPage = Math.floor(firstProductIndex / newPageSize) + 1;
      setCurrentPage(newPage);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentPage, deviceType, pageSize]);

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleKeywordSearch = () => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleKeywordSearch();
    }
  };

  return (
    <>
      {deviceType === "mobile" ? (
        <MobileSearchBar
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onKeyDown={handleKeyDown}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      ) : (
        <DesktopSearchBar
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onKeyDown={handleKeyDown}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      )}

      <div className="sell">
        <div className="sellProductList">
          {products.length === 0 ? (
            <p>No products available</p>
          ) : (
            products.map((item) => {
              const { id, name, price, favoriteCount } = item ?? {};
              return (
                <div key={id} className="sellProductItem">
                  <img
                    className="sellProduct"
                    src={default_img}
                    alt={name ?? "Product image"}
                  />
                  <p className="itemName">{name}</p>
                  <p className="itemPrice">{`${formatPrice(price)} 원`}</p>
                  <p className="itemFavoriteCnt">♡ {favoriteCount ?? "0"}</p>
                </div>
              );
            })
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}

export default SellList;
