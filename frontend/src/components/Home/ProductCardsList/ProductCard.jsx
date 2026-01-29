import { useContext, useState, useEffect, useRef } from 'react'
import CartContext from '../../../context/CartContext'

const ProductCard = ({
    product,
    openProductModal,
    className
}) => {
    const { handleAddToCart } = useContext(CartContext);
    const [hoverTimer, setHoverTimer] = useState(null);
    const cardRef = useRef(null);
    
    // Safety check
    if (!product) {
        console.error('ProductCard received undefined product');
        return null;
    }
    
    // Hover trigger logic (5 seconds) - disabled on touch devices
    const handleMouseEnter = () => {
        // Disable hover trigger on touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            return; // Exit early on touch devices
        }
        
        const timer = setTimeout(() => {
            openProductModal(product);
        }, 5000); // 5 seconds
        setHoverTimer(timer);
    };
    
    const handleMouseLeave = () => {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }
    };
    
    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
            }
        };
    }, [hoverTimer]);
    
    return (
        <>
            <div 
                className={`flex flex-col items-center w-[15.76vw] h-auto text-center m-1.25 bg-white rounded-lg shadow-[0 4px 8px rgba(0, 0, 0, 0.15)] transform-100 border-solid border-2 border-gray min-w-40 max-w-70 scale-100 ${className}`}
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Info button in top-right corner */}
                <button
                    className='product-card-info-button'
                    onClick={() => openProductModal(product)}
                    aria-label="View product details"
                    title="View product details"
                >
                    ℹ️
                </button>
                
                {product.image ? (
                    <img
                        className='product-card-image' 
                        src={product.image} 
                        alt={product.name} 
                        loading="lazy"
                    />
                ) : null}                
                <div className="product-card-name">{product.name}</div>
                <div className="product-card-price">${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
        </>
    )
}

export default ProductCard