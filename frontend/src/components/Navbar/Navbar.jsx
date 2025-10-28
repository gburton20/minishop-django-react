import { SearchInput } from './SearchInput'
import AuthButton from './Auth/AuthButton'
import CartNavIcon from './CartNavIcon/CartNavIcon'
import { Link } from 'react-router-dom'

const Navbar = ({navCartAddCount}) => {

  return (
    <>
      <div className='navbar'>
        <Link to="/">
          <img src='/minishop-nav-logo.svg'/>
        </Link>
        <SearchInput/>
        <AuthButton/>
        <Link to="/cart">
          <CartNavIcon
            navCartAddCount={navCartAddCount}
          />
        </Link>
      </div>
    </>
  )
}

export default Navbar