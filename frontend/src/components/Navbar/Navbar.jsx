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
    <div className={`navbar flex flex-col p-2 gap-2 w-screen 
    
    sm:flex-row sm:items-center sm:gap-1 sm:p-1 sm:pt-4 sm:justify-between sm:w-full sm:pl-2 sm:pr-2

    ${
      hideSearch
      ? 'justify-around'
      : ''
    }
    
    `}>

      <div className={`logo-text-and-log-in-button-section 
      
      order-0 row-1 flex justify-around w-full

      ${
            isAuthenticated 
            ? 'justify-center'
            : ''
          }
      
      sm:contents

      `}>
        
        {/* Minishop thumbnail logo: */}
        <Link to="/" className="order-0 sm:order-0">
          <div className="thumbnail-and-text-div flex order-first
          
          sm:relative sm:bottom-2.5
          ">
              <img
                className="w-14 h-18 object-contain" 
                src="/minishop_logo.svg"
                alt="Minishop logo"
              />
              {/* 'inishop' text */}
              <h1
                className='relative text-4xl font-bold top-6'
                >
                <span className='inline-block bg-[linear-gradient(135deg,#d4bb4f_0%,#5f8f3b_100%)] bg-clip-text text-transparent'>ini</span>shop
              </h1>
          </div>
        </Link>

        {/* 'Log in' <AuthButton component */}
        <div className="relative grow-0 shrink-0 text-center top-6 order-1
        
        sm:relative sm:top-px sm:grow-0 sm:shrink sm:basis-auto sm:text-left sm:order-3
        
        ">
          {!isAuthenticated && (
            <LoginButton/> 
          )}
        </div>
        
      </div> 

      
      {/* 'Log out' <AuthButton component */}
      <div className="order-2 row-2 
      
      sm:order-3
      
      ">
        {isAuthenticated && (
          <AuthButton 
          navCartAddCount={navCartAddCount}
          />
        )}
      </div>

      {!hideSearch && (
        <div className="order-3 grow-0 shrink-0 basis-full w-full py-2 
        
        sm:order-1 sm:grow-0 sm:shrink sm:basis-auto sm:w-[45%] lg:w-[35%]

        ">
          <SearchInput />
        </div>
      )}

      {/* CartNavIcon: hidden on mobile, visible on sm+ */}
      <Link to="/cart" className="order-4 flex-none hidden 
      
      sm:block sm:order-2
      
      ">
        <CartNavIcon navCartAddCount={navCartAddCount} />
      </Link>
    </div>
  )
}

export default Navbar