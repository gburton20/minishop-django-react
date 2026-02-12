import { useEffect, useState, createContext, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import Cart from './components/Cart/Cart'
import Profile from './components/Profile'
import Navbar from './components/Navbar/Navbar'
import Toast from './components/Toast'
import { CartProvider } from './context/CartContext'
import CartContext from './context/CartContext'
import './index.css';

const UserMetadataContext = createContext(null);
export const useUserMetadata = () => useContext(UserMetadataContext);

function App() {

  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
  const getUserMetadata = async () => {
    if (!isAuthenticated) return;
    const domain = "dev-ngpva7twomewnfum.us.auth0.com";
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },
      });
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
      const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { user_metadata } = await metadataResponse.json();
      setMetadata(user_metadata);
    } catch (e) {
      console.log("Error fetching user_metadata:", e.message);
    }
  };
  getUserMetadata();
}, [isAuthenticated, getAccessTokenSilently, user]);

  return (
    <>
      <div>
        <UserMetadataContext.Provider value={metadata}>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </UserMetadataContext.Provider>
      </div>
    </>
  ) 
}

function AppContent() {
  const { toastMessage, showToast, closeToast } = useContext(CartContext);
  
  return (
    <>
      <Navbar/>
      <Routes>
        <Route 
          path="/" 
          element={<Home />}>
        </Route> 
        <Route 
          path="/cart" 
          element={<Cart />}>
        </Route> 
        <Route
          path='/profile' 
          element={<Profile/>}
        />
      </Routes>
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={closeToast}
        duration={3000}
      />
    </>
  );
}

export default App
