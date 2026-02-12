import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button 
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="flex border text-xl p-1 bg-gray-500 text-white rounded-[10px] sm:w-auto"
    >
      Log out
    </button>
  );
};

export default LogoutButton;