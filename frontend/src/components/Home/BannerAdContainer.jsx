import { useState, useEffect } from 'react';
import ProductCard from './ProductCardsList/ProductCard';

const BannerAdContainer = () => {
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
                const response = await fetch('http://localhost:8000/api/daily-product/');
                
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
                <p>No special deal available today. Check back tomorrow!</p>
            </div>
        );
    }

    return (
        <div className='banner-ad-div' style={{ position: 'relative' }}>
            <h1 className='banner-h1'>
                Minishop's deal of the day!
            </h1>
            <div className="daily-product-container">
                <ProductCard
                    category={dailyProduct.category}
                    image={dailyProduct.image ? `http://localhost:8000${dailyProduct.image}` : ''}
                    name={dailyProduct.name}
                    price={dailyProduct.price}
                />
            </div>
        </div>
    );
};

export default BannerAdContainer;