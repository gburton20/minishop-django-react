import { useState, useEffect } from 'react';
import ProductCard from './ProductCardsList/ProductCard';

const BannerAdContainer = ({ openProductModal }) => {
    const [dailyProduct, setDailyProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDailyProduct = async () => {
            const today = new Date().toDateString();
            const cachedData = localStorage.getItem('dailyProduct');
            const cachedDate = localStorage.getItem('dailyProductDate');

        if (cachedData && cachedDate === today) {
            setDailyProduct(JSON.parse(cachedData));
            setLoading(false);
            setError(null); // Add this line
            return;
        }
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/daily-product/`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch daily product');
                }
                
                const data = await response.json();
                setDailyProduct(data);
                setError(null);

                // Add these lines to cache the data:
                localStorage.setItem('dailyProduct', JSON.stringify(data));
                localStorage.setItem('dailyProductDate', today);
            } catch (err) {
                console.error('Error fetching daily product:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyProduct();
    }, []);

    if (loading) {
        return (
            <div className='banner-ad-div' style={{ position: 'relative' }}>
                <h1 className='banner-h1'>
                    Loading today's deal...
                </h1>
            </div>
        );
    }

    if (error || !dailyProduct) {
        return (
            <div className='banner-ad-div' style={{ position: 'relative' }}>
                <h1 className='banner-h1'>
                    Minishop's deal of the day!
                </h1>
                <p className='text-white'>No special deal available today. Check back tomorrow!</p>
            </div>
        );
    }

    return (
        <div 
            className='flex flex-col justify-center items-center py-4 px-3 my-2 bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] rounded-xl'
            style={{ position: 'relative' }}
        >
            <h1 className='text-2xl text-white'>
                Minishop's deal of the day!
            </h1>
            <div className="flex justify-center mt-4 w-[70vw] scale-100 border-2 border-solid border-#ffd700 bg-white rounded-lg shadow-[0 2px 10px rgba(0, 0, 0, 0.1)]
            
            sm:w-[45vw]

            md:w-[37.5vw]

            lg:w-[32.5vw]

            xl:w-[30vw]

            2xl-[27.5vw]

            ">
                <ProductCard
                    product={{
                        ...dailyProduct,
                        // Normalize backend snake_case to the camelCase used across the frontend.
                        availabilityStatus: dailyProduct.availabilityStatus ?? dailyProduct.availability_status ?? 'In Stock',
                        image: dailyProduct.image && dailyProduct.image.startsWith('http')
                        
                            ? dailyProduct.image
                            : dailyProduct.image 
                              ? `${import.meta.env.VITE_API_URL}${dailyProduct.image}`
                              : ''
                    }}
                    openProductModal={openProductModal}
                    className="border-2 border-solid border-[#ffd700]"
                />
            </div>
        </div>
    );
};

export default BannerAdContainer;