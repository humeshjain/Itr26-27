import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

function Products() {
  const { cart, setCart } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "All",
    priceRange: [0, 1000],
    search: "",
  });

  // Fetch products
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Use useMemo instead of useEffect for filtering
  const filteredProducts = useMemo(() => {
    if (products.length === 0) return [];

    let result = [...products];

    if (filters.category !== "All") {
      result = result.filter((p) => p.category === filters.category);
    }

    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [products, filters]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      priceRange: [0, 1000],
      search: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading products</h3>
          <p className="mt-2 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilters({ ...filters, category })}
                className={`category-pill ${
                  filters.category === category ? "active" : ""
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {(filters.category !== "All" || filters.search) && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </label>
          <div className="flex gap-4 mt-2">
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[0]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [Number(e.target.value), filters.priceRange[1]],
                })
              }
              className="flex-1 accent-indigo-600"
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              className="flex-1 accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isInCart = cart.some((item) => item.id === product.id);
            const cartItem = cart.find((item) => item.id === product.id);

            return (
              <div
                key={product.id}
                className="product-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="relative bg-gray-100 h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 capitalize">
                      {product.category}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 btn-primary text-sm flex items-center justify-center gap-1"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>

                  {isInCart && (
                    <div className="mt-2 flex items-center justify-center gap-3 bg-gray-50 rounded-lg p-2">
                      <button
                        onClick={() => handleUpdateQuantity(product.id, (cartItem?.quantity || 1) - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition font-bold"
                      >
                        -
                      </button>
                      <span className="font-medium min-w-[20px] text-center">
                        {cartItem?.quantity || 0}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(product.id, (cartItem?.quantity || 1) + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(product.id)}
                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Products;

// import { useEffect, useState } from "react";

// function Products() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetch("https://fakestoreapi.com/products")
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div>
//       <h1>Products Page</h1>

//       {products.map((product) => (
//         <div
//           key={product.id}
//           style={{
//             border: "1px solid gray",
//             margin: "10px",
//             padding: "10px",
//           }}
//         >
//           <img
//             src={product.image}
//             alt={product.title}
//             width="100"
//           />

//           <h3>{product.title}</h3>

//           <p>₹ {product.price}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Products;

// import { useEffect, useState } from "react";

// function Products() {
//   const [products, setProducts] = useState([]); //usestate: it is a react hook which is use to create a variable 
// const [datavar, setDatavar] = useState([1]);    // initial value can be stored in use state.
// console.log("datavar", datavar);
// useEffect(() => {}
//   useEffect(() => {
//     fetch("https://fakestoreapi.com/products")
//       .then((res) => res.json()) //res means response received from the server.
//                                   //The response is usually in JSON format.
//                                    //res.json() converts that JSON data into a JavaScript object.

//       .then((data) => setProducts(data)) //stores the data in the React state variable products.

//       .catch((err) => console.log(err)); //If any error occurs while fetching data (e.g., no internet, wrong API URL), it is caught here.
//                                           console.log(err) prints the error in the browser console.
//   }, []);
// const handleUpdateData = () => {
//     setDatavar((prevData) => {
//         console.log("prevData", prevData);
//         return prevData *2;
//     });
//     }
//   return (
//     <div>
//       <h1>Products Page</h1>

//       {products.map((product) => (
//         <div
//           key={product.id}
//           style={{
//             border: "1px solid gray",
//             margin: "10px",
//             padding: "10px",
//           }}
//         >
//           <img
//             src={product.image}
//             alt={product.title}
//             width="100"
//           />

//           <h3>{product.title}</h3>

//           <p>₹ {product.price}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Products;

// //render means to load a page.