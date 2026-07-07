/**
 * @file usePagination.js
 * @description Custom React hook for client-side pagination logic.
 *              Computes page numbers, handles navigation, and tracks current page.
 *
 * @example
 *   const { currentPage, totalPages, goToPage, goNext, goPrev } = usePagination({ total: 150, pageSize: 20 });
 */

import { useState, useMemo } from 'react';

/**
 * @param {{ total: number, pageSize?: number, initialPage?: number }} options
 */
function usePagination({ total, pageSize = 20, initialPage = 1 }) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const goToPage = (page) => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(safePage);
  };

  const goNext = () => goToPage(currentPage + 1);
  const goPrev = () => goToPage(currentPage - 1);
  const goFirst = () => goToPage(1);
  const goLast = () => goToPage(totalPages);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    pageNumbers,
    goToPage,
    goNext,
    goPrev,
    goFirst,
    goLast,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
    offset: (currentPage - 1) * pageSize,
  };
}

export default usePagination;
