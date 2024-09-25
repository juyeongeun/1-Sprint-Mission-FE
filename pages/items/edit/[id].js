import { useRouter } from "next/router";
import EditBtn from "@/components/EditProductComponents/EditBtn";
import { fetchProduct } from "@/utils/productApi";
import styles from "./[id].module.css";
import { useQuery } from "@tanstack/react-query";

export default function EditItems() {
  const router = useRouter();
  const { id } = router.query;

  const {
    error,
    isLoading,
    data: product,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("인증 토큰이 없습니다.");
      return fetchProduct(id, token);
    },
  });

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      <EditBtn item={product} />
    </div>
  );
}
