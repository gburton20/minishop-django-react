import { useAuth0 } from "@auth0/auth0-react";
import { SearchInput } from './SearchInput'
import AuthButton from './Auth/AuthButton'
import CartNavIcon from './CartNavIcon/CartNavIcon'
import { Link, useLocation } from 'react-router-dom'
import LoginButton from "./Auth/Log in and log out buttons/LoginButton";

const Navbar = ({navCartAddCount}) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth0();

  const hideSearch = location.pathname.startsWith('/cart');

  return (
    <>
      <div className='navbar flex flex-col p-2 gap-2 
      
      sm:flex-row
      
      '>
        <div className={`logo-text-and-log-in-button-section order-1 row-1 flex flex-wrap justify-around
        ${
              isAuthenticated 
              ? 'justify-center'
              : ''
            }
        
        `}>
          
          <div className={`logo-and-text-section flex
            
          
          `}>
            {/* Minishop thumbnail logo: */}
            <Link to="/">
              <img 
                className='logo w-[18vw] h-[10vh] align-middle'
                src="/minishop_logo.svg"
                alt="Minishop logo"
                />
            </Link>

            {/* 'inishop' text */}
            <h1
              className='relative top-8 text-4xl font-bold text-right'
              >
              <span className='inline-block bg-[linear-gradient(135deg,#d4bb4f_0%,#5f8f3b_100%)] bg-clip-text text-transparent'>ini</span>shop
            </h1>
          </div>

          {/* Logged OUT <AuthButton component */}
          <div className="relative grow-0 shrink-0 text-center top-9 flex-none
          
          sm:order-0 sm:grow-0 sm:shrink sm:basis-auto sm:text-left
          
          "
          >
            {!isAuthenticated && (
              <LoginButton/> 
            )}
          </div>
        </div>

        {/* Logged IN <AuthButton component */}
        <div className="order-2 row-2">
          {isAuthenticated && (
            <AuthButton 
            navCartAddCount={navCartAddCount}
            />
          )}
        </div>





        {!hideSearch && (
          <div className="order-3 grow-0 shrink-0 basis-full w-full py-2 sm:order-0 sm:grow-0 sm:shrink sm:basis-auto">
            <SearchInput />
          </div>
        )}

        {/* CartNavIcon: hidden on mobile, visible on sm+ */}
        <Link to="/cart" className="order-4 flex-none hidden sm:block sm:order-0">
          <CartNavIcon navCartAddCount={navCartAddCount} />
        </Link>
      </div>
    </>
  )
}

export default Navbar