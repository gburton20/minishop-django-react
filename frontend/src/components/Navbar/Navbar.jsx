import { SearchInput } from './SearchInput'
import AuthButton from './Auth/AuthButton'
import CartNavIcon from './CartNavIcon/CartNavIcon'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({navCartAddCount}) => {
  const location = useLocation();

  const hideSearch = location.pathname.startsWith('/cart');

  return (
    <>
      {/* TODO: Complete Tailwind migration - remove .navbar class */}
      <div className='navbar flex flex-row flex-wrap justify-between items-center max-w-full p-4 gap-4'>
        {/* Minishop logo: */}
        <Link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="920" height="260" viewBox="0 0 920 260" role="img" aria-label="Minishop logo">
            <defs>
              <linearGradient id="gPurple" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stop-color="#667eea"/>
                <stop offset="100%" stop-color="#764ba2"/>
              </linearGradient>

              <linearGradient id="gGold" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stop-color="#ead266"/>
                <stop offset="100%" stop-color="#77a24b"/>
              </linearGradient>

              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000" flood-opacity="0.12"/>
              </filter>

              <style>
                .wordmark {
                  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
                  font-weight: 800;
                  letter-spacing: -0.02em;
                }
                .tagline {
                  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
                  font-weight: 600;
                  letter-spacing: 0.01em;
                }
              </style>
            </defs>

            {/* <!-- White background --> */}
            <rect width="100%" height="100%" fill="#ffffff"/>

            {/* <!-- Icon --> */}
            <g transform="translate(72,44)" filter="url(#softShadow)">
              {/* <!-- Bag body --> */}
              <rect x="0" y="38" width="172" height="172" rx="44" fill="url(#gPurple)"/>

              {/* <!-- Handle (cutout look with white stroke) --> */}
              <path d="M52 74c0-26 16-42 34-42s34 16 34 42"
                    fill="none"
                    stroke="#ffffff"
                    stroke-width="14"
                    stroke-linecap="round"
                    opacity="0.95"/>

              {/* <!-- Inner panel highlight --> */}
              <path d="M34 88c12 16 34 26 52 26s40-10 52-26v92c0 22-16 38-38 38H72c-22 0-38-16-38-38V88z"
                    fill="#ffffff"
                    opacity="0.10"/>

              {/* <!-- "M" mark (gold gradient) --> */}
              <path d="M46 170
                      c0-34 0-56 0-66
                      c0-6 6-10 12-7
                      l30 18
                      c3 2 7 2 10 0
                      l30-18
                      c6-3 12 1 12 7
                      c0 10 0 32 0 66
                      c0 7-6 12-12 12
                      h-10
                      c-6 0-12-5-12-12
                      v-29
                      l-13 8
                      c-4 2-8 2-12 0
                      l-13-8
                      v29
                      c0 7-6 12-12 12
                      h-10
                      c-6 0-12-5-12-12z"
                    fill="url(#gGold)"/>

              {/* <!-- Small sparkle --> */}
              <g opacity="0.95">
                <path d="M140 116l6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill="#ffffff" opacity="0.9"/>
                <circle cx="150" cy="132" r="3.5" fill="#ffffff" opacity="0.8"/>
              </g>
            </g>

            {/* <!-- Wordmark --> */}
            <g transform="translate(280,118)">
              <text x="0" y="0" font-size="72" class="wordmark" fill="#111827">
                Mini<tspan fill="url(#gPurple)">shop</tspan>
              </text>

              {/* <!-- Optional subtle underline accent using gold gradient --> */}
              <rect x="4" y="18" width="220" height="8" rx="4" fill="url(#gGold)" opacity="0.85"/>

              {/* <!-- Optional tiny descriptor (remove if you want only the wordmark) --> */}
              <text x="4" y="56" font-size="18" class="tagline" fill="#6b7280">
                e-commerce web app
              </text>
            </g>
        </svg>

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