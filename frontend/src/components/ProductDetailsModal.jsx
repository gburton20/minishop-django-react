import { useContext, useEffect, useRef } from 'react'
import StarRatings from 'react-five-star-rating'
import CartContext from '../context/CartContext';

const ProductDetailsModal = ({
  product,
  closeModal,
  isModalOpen,
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);
  const { handleAddToCart } = useContext(CartContext);

  // Focus management and scroll lock
  useEffect(() => {
    if (isModalOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Focus trap - keep Tab navigation within modal
  useEffect(() => {
    function handleTabKey(event) {
      if (!isModalOpen || event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // If shift+tab on first element, go to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // If tab on last element, go to first
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleTabKey);
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isModalOpen]);

  // Handle clicking outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    }
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalOpen, closeModal]);

  // Handle ESC key
  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }
    if (isModalOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen, closeModal]);

  // Product rating conditional formatting:
  const rating = Number(product?.rating);
  const hasRating = Number.isFinite(rating);
  const starFillColor = !hasRating
    ? undefined
    : rating < 2.5
      ? "#ef4444" 
      : rating <= 3.9
        ? "#f97316" 
        : "#22c55e"; 
        
  // Product availability conditional formatting:
  const availabilityRaw = product?.availabilityStatus;
  const availabilityText = availabilityRaw ?? "In Stock";
  const availabilityClass =
    availabilityRaw == null ? "" :
    availabilityRaw === "Out of Stock" ? "text-red-500" :
    availabilityRaw === "Low Stock" ? "text-orange-500": 
    "text-green-500";

  if (!product) return null;

  return (
    <>
      <div 
      className={`fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-1000 transition-opacity duration-300
        ${isModalOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
        }
      `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-name"
        aria-describedby="modal-product-description"
      >
        <div 
          className='bg-white p-7.5 rounded-xl shadow-[0 10px 40px rgba(0, 0, 0, 0.3)] w-[90%] max-w-150 max-h-[85vh] overflow-y-auto transform-[scale(1)] transition-[transform 0.3s ease] sm:w-[85%] s:p-[35px] md:w-[80%]'
          ref={modalRef}
        >
          {/* Close button */}
          <div className='flex justify-end mb-2.5'>
            <button
              ref={closeButtonRef}
              className='p-1 transition-[opacity 0.2s ease] hover:opacity-[0.7]' 
              onClick={closeModal} 
              aria-label="Close product details"
              style={{cursor: 'pointer', background: 'none', border: 'none'}}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <line x1="4" y1="4" x2="16" y2="16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="4" x2="4" y2="16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Product image */}
          {product.image && (
            <div className='w-full max-h-75 flex justify-center mb-5 overflow-hidden rounded-lg border-2 border-gray-500
            
            sm:max-h-87.5

            md:max-h-100

            lg:max-h-112.5
            
            '>
              <img 
                src={product.image} 
                alt={`${product.name} product image`}
                className='max-w-full max-h-75 object-contain
                
                sm:max-h-87.5

                md:max-h-100

                lg:max-h-112.5

                '
              />
            </div>
          )}

          {/* Product name */}
          <h2 
            id="modal-product-name"
            className='text-[24px] font-semibold text-[#333] mb-3.75 text-center
            
            sm:text-[26px]

            md:text-[28px] md:mb-5

            lg:text-[30px]
            '
          >
            {product.name}
          </h2>

          <div className='all-product-info mx-2.5'>
            <div className='headline-product-info text-[16px] text-[#555] md:text-[17px] md:mx-3 lg:text-[18px]'>
              {/* Product brand */}
              {product.brand && (
                <div>
                  <strong>Brand:</strong> {product.brand}
                </div>
              )}

              {/* Product price */}
              <div>
                <strong>Price:</strong> ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              {/* Product discount percentage */}
              {product.discountPercentage > 0 && (
                <div>
                  <strong>Discount: </strong> 
                  <span className='text-red-500'>
                    -{product.discountPercentage}%
                  </span>
                </div>
              )}

              {/* Product rating */}
              {hasRating && (
                <div className='flex flex-wrap gap-x-2 items-center'>
                  <strong>Customers' rating: </strong>
                  <StarRatings
                    rating={rating}
                    containerClassName="h-5 w-5"
                    starFillColor={starFillColor}
                  />
                  <span>{rating} / 5.0 ⭐️</span>
                </div>
              )}

              {/* Product availability status */}
              <div>
                  <strong>Availability: </strong> 
                <span className={availabilityClass}>   
                  {availabilityText}
                </span>
              </div>


              {/* Product description */}
              {product.description && (
                <div 
                id="modal-product-description"
                className='py-5 lg:my-6.25'
                >
                  <strong className="mb-2">Description:</strong>
                  <p className="text-[#666]">{product.description}</p>
                </div>
              )}
              </div>
          </div>
          

          <div className="flex flex-col items-center my-2">
            <button
              className='flex w-fit bg-[linear-gradient(135deg,#ead266_0%,#77a24b_100%)] text-white rounded-[10px] m-1.25 hover:bg-[linear-gradient(135deg,#d4bb4f_0%,#5f8f3b_100%)] h-[10%] border-solid border-2 border-gray-500 px-4 py-2 items-center'
              onClick={() => {
                  const productDataPerClick = {
                      category: product.category,
                      image: product.image,
                      name: product.name,
                      price: product.price
                  }
                  handleAddToCart(productDataPerClick);
              }}
            >
              <div className='text-[wrap]'>
              Add to cart
              </div>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default ProductDetailsModal