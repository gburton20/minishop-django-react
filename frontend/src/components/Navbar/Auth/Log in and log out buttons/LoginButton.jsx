import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className='flex justify-center'>
      <button 
        className="flex text-xl p-1 bg-[#05ABF3] text-white rounded-[10px]"
        onClick={() => loginWithRedirect()}>
        Log in
      </button>
    </div> // End of log-in-button-container
  )
};

export default LoginButton;