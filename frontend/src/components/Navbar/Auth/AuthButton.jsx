import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./Log in and log out buttons/LoginButton";
import LogoutButton from "./Log in and log out buttons/LogoutButton";
import { FaUserCircle } from "react-icons/fa";
import CartNavIcon from "../CartNavIcon/CartNavIcon";
import { Link } from 'react-router-dom'

const AuthButton = ({ navCartAddCount }) => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <>
      {!isAuthenticated ? (
        <LoginButton/>
      ) : (
        <div className='flex bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] h-22 rounded-lg justify-around items-center m-1
        
        sm:bg-none sm:gap-4
        
        lg:justify-between lg:bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] lg:p-2 lg:h-auto lg:py-1'>
          <div className="flex items-center justify-between gap-2 text-white sm:hidden lg:flex lg:text-white">
            <LogoutButton className="sm:hidden" />
            <FaUserCircle/> Welcome, {user.name}
          </div>
          <Link to="/cart">
            <div className="sm:hidden">
              <CartNavIcon navCartAddCount={navCartAddCount} />
            </div>
          </Link>
          <div className="hidden sm:flex sm:items-center sm:h-full lg:hidden">
            <LogoutButton/>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthButton;