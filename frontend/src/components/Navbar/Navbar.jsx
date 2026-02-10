import { SearchInput } from './SearchInput'
import AuthButton from './Auth/AuthButton'
import CartNavIcon from './CartNavIcon/CartNavIcon'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({navCartAddCount}) => {
  const location = useLocation();

  const hideSearch = location.pathname.startsWith('/cart');

  return (
    <>
      <div className='navbar flex flex-col items-center max-w-full p-4 gap-4 
      
      sm:flex-row
      
      '>
        <div className='logo-and-text-section flex flex-row w-full justify-center'>
          {/* Minishop logo: */}
          <div className='order-1
          
          sm:order-0 sm:w-auto
          
          '>
            <Link to="/">
              <img 
                className='logo w-[20vw] h-[10vh] align-middle'
                src="/minishop_logo.svg"
                alt="Minishop logo"
                />
            </Link>
          </div>

          {/* Minishop text */}
          <div className="order-2 flex relative top-8 text-4xl">
            {/* <hr className="my-1 h-1.25 w-full border-0 rounded-2xl bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]" /> */}
            <h1
              className='font-bold text-right'
            >
              <span className='inline-block bg-[linear-gradient(135deg,#d4bb4f_0%,#5f8f3b_100%)] bg-clip-text text-transparent'>ini</span>shop
            </h1>
          </div>
        </div>

        {!hideSearch && (
          <div className="order-5 grow-0 shrink-0 basis-full sm:order-0 sm:grow-0 sm:shrink sm:basis-auto">
            <SearchInput />
          </div>
        )}

        <div className="order-4 grow-0 shrink-0 basis-full text-center sm:order-0 sm:grow-0 sm:shrink sm:basis-auto sm:text-left">
          <AuthButton navCartAddCount={navCartAddCount} />
        </div>
        {/* CartNavIcon: hidden on mobile, visible on sm+ */}
        <Link to="/cart" className="order-3 flex-none hidden sm:block sm:order-0">
          <CartNavIcon navCartAddCount={navCartAddCount} />
        </Link>
      </div>
    </>
  )
}

export default Navbar