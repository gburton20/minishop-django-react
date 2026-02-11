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
                className={`flex flex-col items-center w-full min-w-0 h-auto text-center m-1.25 bg-white rounded-lg shadow-[0 4px 8px rgba(0, 0, 0, 0.15)] transform-100 border-solid border-2 border-gray max-w-70 scale-100 ${className}`}
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Info button in top-right corner */}
                <button
                    className='absolute top-2 right-2 bg-[rgba(255, 255, 255, 0.9)] border-solid border border-[#ddd] rounded-[50%] w-8 h-8 flex items-center justify-center cursor-pointer text-[18px] transition-[ease] z-10 hover:bg-white hover:transform-[scale(1.1)] shadow-[0 2px 8px rgba(0, 0, 0, 0.15)]'
                    onClick={() => openProductModal(product)}
                    aria-label="View product details"
                    title="View product details"
                >
                    ℹ️
                </button>
                
                {product.image ? (
                    <img
                        className='h-[63.72%] w-full' 
                        src={product.image} 
                        alt={product.name} 
                        loading="lazy"
                    />
                ) : null}                
                <div className="mt-2.5 mb-1.25">{product.name}</div>
                <div className="mb-1.25">${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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