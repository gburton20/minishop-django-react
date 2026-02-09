import { SearchInput } from './SearchInput'
import AuthButton from './Auth/AuthButton'
import CartNavIcon from './CartNavIcon/CartNavIcon'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({navCartAddCount}) => {
  const location = useLocation();

  const hideSearch = location.pathname.startsWith('/cart');

  return (
    <>
      <div className='navbar flex flex-col flex-wrap
      
      md:flex-row
      
      '>

        {/* Minishop logo: */}
        <Link to="/" className="flex flex-row">
          <img 
            className='logo w-[25vw] h-[10vh] align-middle'
            src="/minishop_logo.svg"
            alt="Minishop logo"
            />
          <div>
            <h1
              className='font-bold'
            >
              Minishop
            </h1>

            <hr className="my-1 h-[5px] w-full border-0 rounded-2xl bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]" />

            <h3
              className='font-extrabold'
            >
              The e-commerce app
            </h3>
          </div>
        </Link>


        {!hideSearch && <SearchInput/>}
        <AuthButton navCartAddCount={navCartAddCount} />
        {/* CartNavIcon: hidden on mobile, visible on sm+ */}
        <Link to="/cart" className="hidden sm:block">
          <CartNavIcon navCartAddCount={navCartAddCount} />
        </Link>
      </div>
    </>
  )
}

export default Navbar