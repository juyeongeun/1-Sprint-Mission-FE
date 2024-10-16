import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/utils/productApi";
import { throttle } from "@/utils/throttle";
import { useState, useEffect } from "react";

export const useProducts = (
  initialProducts,
  initialTotalCount,
  initialItemsPerPage = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [orderBy, setOrderBy] = useState("recent");
  const [keyword, setKeyword] = useState("");

  const { data, error, isLoading } = useQuery({
    queryKey: ["products", currentPage, itemsPerPage, orderBy, keyword],
    queryFn: () =>
      fetchProducts({
        pageSize: itemsPerPage,
        page: currentPage,
        keyword,
        orderBy,
      }),
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    initialData: {
      list: initialProducts,
      totalCount: initialTotalCount,
    },
    ...queryOptions,
  });

  const calculateTotalPages = (totalCount, itemsPerPage) => {
    return Math.ceil(totalCount / itemsPerPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSortOrder) => {
    setOrderBy(newSortOrder);
    setCurrentPage(1);
  };

  const handleKeywordSearch = (newKeyword) => {
    setKeyword(newKeyword);
    setCurrentPage(1);
  };

  const updateItemsPerPage = () => {
    const screenWidth = window.innerWidth;
    let newItemsPerPage;

    if (screenWidth <= 743) {
      newItemsPerPage = 4;
    } else if (screenWidth <= 1199) {
      newItemsPerPage = 6;
    } else {
      newItemsPerPage = 10;
    }

    setItemsPerPage(newItemsPerPage);
  };

  const throttledUpdateItemsPerPage = throttle(updateItemsPerPage, 200);

  useEffect(() => {
    throttledUpdateItemsPerPage();
    window.addEventListener("resize", throttledUpdateItemsPerPage);

    return () => {
      window.removeEventListener("resize", throttledUpdateItemsPerPage);
    };
  }, []);
  return {
    products: data?.list || [],
    totalCount: data?.totalCount || 0,
    itemsPerPage,
    currentPage,
    totalPages: calculateTotalPages(data?.totalCount || 0, itemsPerPage),
    loading: isLoading,
    error,
    handlePageChange,
    handleSortChange,
    handleKeywordSearch,
  };
};
