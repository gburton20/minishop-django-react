import CartItemCounter from './CartItemCounter';
import { IoCartOutline } from "react-icons/io5";

const CartNavIcon = ({navCartAddCount}) => {
  return (
    <>
      <div className='relative text-white sm:text-black'>
        <IoCartOutline
          className='w-10 h-10'
        />
        <CartItemCounter
          navCartAddCount={navCartAddCount}
        />
      </div>
    </>
  )
}

export default CartNavIcon