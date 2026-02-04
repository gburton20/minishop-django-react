import ProductCard from './ProductCard';

const ProductCardsList = ({
  products,
  handleAddToCart,
  openProductModal,
}) => {

  return (
    <div className="flex flex-wrap justify-around mt-2.5">
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