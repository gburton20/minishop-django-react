import ProductCard from './ProductCard';

const ProductCardsList = ({
  products,
  handleAddToCart,
  openProductModal,
}) => {

  return (
    <div className="grid grid-cols-2 pl-1 pr-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-3 mt-2.5 justify-items-center">
      {products.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          handleAddToCart={handleAddToCart}
          openProductModal={openProductModal}
        />
      ))}
    </div>
  );
}

export default ProductCardsList