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
      <div className={`navbar flex flex-col p-2 gap-2 
      
      sm:flex-row sm:items-center sm:gap-1 sm:p-1

      ${
        hideSearch
        ? 'justify-around'
        : ''
      }
      
      `}>
        <div className={`logo-text-and-log-in-button-section order-0 row-1 flex flex-wrap justify-around

        ${
              isAuthenticated 
              ? 'justify-center'
              : ''
            }
        
        sm:order-0 sm:flex-nowrap

        `}>
          
          <div className={`logo-section flex pt-2`}>
            {/* Minishop thumbnail logo: */}
            <Link to="/">
              <img 
                className='logo w-[40vw] h-[20vw] align-middle
                
                sm:w-[9vw] sm:h-[8vh] relative bottom-2

                md:w-[18vw] md:h-[10vh]
                
                '
                src="/entire_minishop_logo_(with text).svg"
                alt="Minishop logo"
                />
            </Link>
          </div>

          {/* 'Log in' <AuthButton component */}
          <div className="relative grow-0 shrink-0 text-center top-9 flex-none
          
          sm:order-2 sm:grow-0 sm:shrink sm:basis-auto sm:text-left
          
          "
          >
            {!isAuthenticated && (
              <LoginButton/> 
            )}
          </div>
        </div>

        {/* 'Log out' <AuthButton component */}
        <div className="order-2 row-2 
        
        sm:order-2
        
        ">
          {isAuthenticated && (
            <AuthButton 
            navCartAddCount={navCartAddCount}
            />
          )}
        </div>

        {!hideSearch && (
          <div className="order-3 grow-0 shrink-0 basis-full w-full py-2 
          
          sm:order-1 sm:grow-0 sm:shrink sm:basis-auto sm:w-[45%]


          ">
            <SearchInput />
          </div>
        )}

        {/* CartNavIcon: hidden on mobile, visible on sm+ */}
        <Link to="/cart" className="order-4 flex-none hidden sm:block sm:order-1">
          <CartNavIcon navCartAddCount={navCartAddCount} />
        </Link>
      </div>
    </>
  )
}

export default Navbar