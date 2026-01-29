import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className='flex justify-center'>
      <button 
        className="flex text-xl p-1 bg-[linear-gradient(135deg,#ead266_0%,#77a24b_100%)] text-white rounded-[10px] hover:bg-[linear-gradient(135deg,#d4bb4f_0%,#5f8f3b_100%)]
"
        onClick={() => loginWithRedirect()}>
        Log in
      </button>
    </div> // End of log-in-button-container
  )
};

export default LoginButton;