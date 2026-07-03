import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CartDrawer from "../components/CartDrawer";

function Layout() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <>
      <Navbar 
        cartCount={getTotalItems()} 
        onCartClick={() => setIsCartOpen(true)}
      />
      <main className="flex-1">
        <Outlet context={{ cart, setCart }} />
      </main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        totalPrice={getTotalPrice()}
        clearCart={clearCart}
      />
    </>
  );
}

export default Layout;

// import React from "react";
// import { Outlet } from "react-router-dom";

// function Layout() {
//   return (
//     <>
//       <header>
//         <h1>My Website</h1>
//       </header>

//       <main>
//         <Outlet />
//       </main>

//       <footer>
//         <p>© 2026 My Website</p>
//       </footer>
//     </>
//   );
// }

// export default Layout;