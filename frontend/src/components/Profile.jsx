import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [backendUser, setBackendUser] = useState(null);

  useEffect(() => {
    const sendJWTToBackend = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://dev-ngpva7twomewnfum.us.auth0.com/api/v2/",
            scope: "openid profile email",
          },
        });
        console.log("Auth0 access token:", accessToken);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBackendUser(data);
        } else {
          setBackendUser(null);
        }
      } catch (e) {
        console.log(e.message);
        console.log("Error getting access token:", e);

      }
    };
    sendJWTToBackend();
  }, [getAccessTokenSilently]);


  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="flex flex-col items-center px-4.5">
        <img 
          src={user.picture} 
          alt={user.name}
          className="block mx-auto rounded-lg p-4 my-1.5" 
        />
        <div className="justify-items-left">
          <h2 className="my-1.5">
            <strong>Username: </strong>{user.name}
          </h2>
          <h2 className="my-1.5">
            <strong>Email address:</strong> {user.email}
          </h2>
          <h2 className="my-1.5 flex flex-col pb-1">
            <strong>Copy of complete user data object:</strong>
          </h2>
        </div>
        {backendUser ? (
          <pre className="text-sm whitespace-pre-wrap wrap-break-word max-w-full overflow-auto px-4">{JSON.stringify(backendUser, null, 2)}</pre>
        ) : (
          "No backend user data returned"
        )}
    </div>
  );
};

export default Profile;