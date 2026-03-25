export const getPaginationRange = (currentPage: number, totalPages: number) => {
  const delta = 2;
  const range: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
      range.push("...");
    }
  }

  return range.filter((item, index) => range.indexOf(item) === index);
};
