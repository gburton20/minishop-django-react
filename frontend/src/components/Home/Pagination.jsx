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
    <div className="flex justify-center items-center gap-2 my-8 flex-wrap">
      <button 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-[#ddd] bg-white text-[#333] cursor-pointer rounded transition-all duration-200 text-sm hover:bg-[#f5f5f5] hover:border-[#999] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start
      </button>
      
      <button 
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-[#ddd] bg-white text-[#333] cursor-pointer rounded transition-all duration-200 text-sm hover:bg-[#f5f5f5] hover:border-[#999] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <div className="flex gap-1 items-center">
        {getPageNumbers().map((pageNumber, index) => (
          pageNumber === '...' ? (
            <span key={`ellipsis-${index}`} className="px-1 py-2 text-[#666]">...</span>
          ) : (
            <button
              key={`page-${pageNumber}`}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-2 border cursor-pointer rounded transition-all duration-200 text-sm ${
                currentPage === pageNumber 
                  ? 'bg-[linear-gradient(135deg,#ead266_0%,#77a24b_100%)] text-white border-black' 
                  : 'border-[#ddd] bg-white text-[#333] hover:bg-[#f5f5f5] hover:border-[#999]'
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
        className="px-3 py-2 border border-[#ddd] bg-white text-[#333] cursor-pointer rounded transition-all duration-200 text-sm hover:bg-[#f5f5f5] hover:border-[#999] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
      
      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-[#ddd] bg-white text-[#333] cursor-pointer rounded transition-all duration-200 text-sm hover:bg-[#f5f5f5] hover:border-[#999] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        End
      </button>
    </div>
  );
};

export default Pagination;