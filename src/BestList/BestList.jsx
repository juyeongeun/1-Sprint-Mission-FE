import { useFetchProducts } from "../common/useFetchProducts";
import { formatPrice } from "../common/Util";
import { useDeviceType } from "../common/useDeviceType";
import "./BestList.css";

export function BestList() {
  const deviceType = useDeviceType();

  // Product.js에서 API GET (favorite 기준 정렬)
  const { products } = useFetchProducts({
    orderBy: "favorite",
    pageSize: deviceType === "mobile" ? 1 : deviceType === "tablet" ? 2 : 4,
  });

  return (
    <div className="best">
      <p className="fontStyle">베스트 상품</p>
      <div className="bestProductList">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((item) => {
            const { id, images, name, price, favoriteCount } = item ?? {};
            return (
              <div key={id} className="bestProductItem">
                <img
                  className="bestProduct"
                  src={images?.[0] ?? "No image"}
                  alt={name ?? "Product image"}
                />
                <p className="itemName">{name ?? "No name"}</p>
                <p className="itemPrice">
                  {price ? `${formatPrice(price)} 원` : "No price"}
                </p>
                <p className="itemFavoriteCnt">♡ {favoriteCount ?? "0"}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}