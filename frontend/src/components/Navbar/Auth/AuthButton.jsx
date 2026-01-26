import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./Log in and log out buttons/LoginButton";
import LogoutButton from "./Log in and log out buttons/LogoutButton";
import { FaUserCircle } from "react-icons/fa";


const AuthButton = () => {
  const { isAuthenticated, user } = useAuth0();
  
  return (
    <>
      {!isAuthenticated ? (
        <LoginButton/>
      ) : (
        <div className='flex justify-around items-center bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] h-22 rounded-lg sm:bg-none sm:gap-4 sm:justify-center lg:justify-between lg:bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] lg:p-2 lg:h-auto lg:py-1'>
          <div className="flex items-center gap-2 text-white sm:hidden lg:flex lg:text-white">
            <FaUserCircle/> Welcome, {user.name}
          </div>
          <LogoutButton/>
        </div>
      )}
    </>
  );
}

export default AuthButton;