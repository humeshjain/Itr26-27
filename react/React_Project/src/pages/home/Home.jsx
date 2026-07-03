import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ShopVerse</span>
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your one-stop shop for amazing products at great prices!
        </p>
        <p className="text-gray-500 mb-8">
          Browse our collection of high-quality products and enjoy a seamless shopping experience.
        </p>
        <Link
          to="/products"
          className="inline-block btn-primary text-lg px-8 py-3"
        >
          Start Shopping
        </Link>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
          <p className="text-sm text-gray-500">Get your products delivered quickly</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="font-semibold text-gray-800">Secure Payments</h3>
          <p className="text-sm text-gray-500">Shop with confidence and security</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🔄</div>
          <h3 className="font-semibold text-gray-800">Easy Returns</h3>
          <p className="text-sm text-gray-500">Hassle-free return policy</p>
        </div>
      </div>
    </div>
  );
}

export default Home;