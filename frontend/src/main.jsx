import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import {Provider} from 'react-redux'
import { store } from './store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain='dev-ngpva7twomewnfum.us.auth0.com'
        clientId='cUbyRQeg2wJ5prOvvP9ymfNAV8KiZyYh'
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://dev-ngpva7twomewnfum.us.auth0.com/api/v2/",
          scope: "openid profile email read:current_user update:current_user_metadata"
        }}    >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0Provider>
    </Provider>
  </StrictMode>
)
