import React, { useState } from "react";
import { useFetchProducts } from "../common/useFetchProducts";
import Pagination from "../Pagination/Pagination";
import { formatPrice } from "../common/Util";
import { useDeviceType } from "../common/usePageSize";
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

  const { products, totalPages } = useFetchProducts({
    pageSize: deviceType === "mobile" ? 4 : deviceType === "tablet" ? 6 : 10,
    page: currentPage,
    keyword: searchKeyword,
  });

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
            products.map((item) => (
              <div key={item._id} className="sellProductItem">
                <img
                  className="sellProduct"
                  src={default_img}
                  alt={item.name ?? "Product image"}
                />
                <p className="itemName">{item.name ?? "No name"}</p>
                <p className="itemPrice">
                  {item.price ? `${formatPrice(item.price)} 원` : "No price"}
                </p>
                <p className="itemFavoriteCnt">♡ {item.favoriteCount ?? "0"}</p>
              </div>
            ))
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
