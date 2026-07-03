function CartDrawer({ isOpen, onClose, cart, setCart, totalPrice, clearCart }) {
  if (!isOpen) return null;

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="cart-overlay fixed inset-0" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-4 text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400">Start adding some products!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item bg-gray-50 rounded-lg p-3 flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm truncate">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition font-bold"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <button className="w-full btn-primary text-center">
                Proceed to Checkout
              </button>
              <p className="text-xs text-gray-500 text-center">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;