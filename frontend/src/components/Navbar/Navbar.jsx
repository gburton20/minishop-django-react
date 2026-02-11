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
    <div className={`navbar 
      ${
        hideSearch
        ? 'justify-around flex-row sm:grid sm:grid-cols-3 sm:grid-rows-1 sm:items-center sm:justify-items-center'
        : 'flex flex-col p-2 gap-2 w-screen sm:flex-row sm:items-center sm:gap-1 sm:p-1 sm:pt-4 sm:justify-between sm:w-full sm:pl-2 sm:pr-2'
      }
    
    `}>

      <div className={`logo-and-text-section 
      
        order-0 row-1 flex justify-around w-full

        ${
          isAuthenticated 
          ? 'justify-center'
          : ''
        }
        
        ${
          hideSearch 
          ? 'sm:col-start-1 sm:row-start-1 sm:justify-self-start sm:justify-start sm:w-max' : 'sm:contents'
        }

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

        
      </div> 

      {/* 'Log in' <AuthButton component */}
      <div className={`absolute top-9 right-4 grow-0 shrink-0 text-center 
      
        sm:relative sm:top-px sm:grow-0 sm:shrink sm:basis-auto sm:text-left sm:order-3
        ${
          hideSearch 
          ? 'relative top-6 sm:col-start-3 sm:row-start-1 sm:justify-self-end' : ''
        }
      
      `}>
        {!isAuthenticated && (
          <LoginButton/> 
        )}
      </div>

      {/* 'Log out' <AuthButton component */}
      <div className={`order-2 row-2 
      
        sm:order-3

      ${hideSearch ? 'sm:col-start-3 sm:row-start-1 sm:justify-self-end' : ''}
      
      `}>
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
    <Link to="/cart" className={`order-4 flex-none hidden 
      
        sm:flex sm:items-center sm:justify-self-center sm:order-2

        ${hideSearch ? 'sm:col-start-2 sm:row-start-1' : ''}

      `}>
        <CartNavIcon navCartAddCount={navCartAddCount}/>
      </Link>
    </div>
  )
}

export default Navbar