import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
import Products from "./pages/products/Product";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

// import React from "react";
// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   RouterProvider,
// } from "react-router-dom";

// import Layout from "./layout/layout";
// import Home from "./pages/Home";

// function App() {
//   const router = createBrowserRouter(
//     createRoutesFromElements(
//       <Route path="/" element={<Layout />}>
//         <Route index element={<Home />} />
//       </Route>
//     )
//   );

//   return <RouterProvider router={router} />;
// }

// export default App;