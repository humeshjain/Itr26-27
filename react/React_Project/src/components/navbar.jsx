import { NavLink } from "react-router-dom";

function Navbar({ cartCount = 0, onCartClick }) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ShopVerse
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/products" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Products
            </NavLink>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center badge-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

