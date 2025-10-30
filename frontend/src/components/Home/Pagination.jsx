const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPreviousPage, 
  onNextPage 
}) => {
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, current page range, and last page
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className="pagination-button pagination-prev"
      >
        Previous
      </button>
      
      <div className="pagination-numbers">
        {getPageNumbers().map((pageNumber, index) => (
          pageNumber === '...' ? (
            <span key={index} className="pagination-ellipsis">...</span>
          ) : (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`pagination-button ${
                currentPage === pageNumber ? 'pagination-active' : ''
              }`}
            >
              {pageNumber}
            </button>
          )
        ))}
      </div>
      
      <button 
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="pagination-button pagination-next"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;