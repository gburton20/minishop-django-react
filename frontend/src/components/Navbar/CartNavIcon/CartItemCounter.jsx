import { useContext } from 'react';
import CartContext from '../../../context/CartContext';

const CartItemCounter = () => {
  const { navCartAddCount } = useContext(CartContext);

  return (
    <div className='flex items-center justify-center absolute -bottom-1 -right-1 bg-red-600 text-white text-xs font-bold w-5.75 h-5.75 rounded-full pointer-events-none'>
      {navCartAddCount}
    </div>
  );
};

export default CartItemCounter;