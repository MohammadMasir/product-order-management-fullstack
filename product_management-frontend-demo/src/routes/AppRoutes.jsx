import { createBrowserRouter } from "react-router";

import MainLayout from "../layout/MainLayout";
import RequireAuth from "../components/RequireAuth";

import ProductListingPage from "../pages/ProductListingPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ProductCatalogPage from "../pages/ProductCatalogPage";
import AddProductPage from "../pages/AddProductPage";
import CartPage from "../pages/CartPage";
import PostCheckoutPage from "../pages/PostCheckoutPage";
import OrdersPage from "../pages/OrdersPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ErrorPage from "../pages/ErrorPage";

export const routes = [
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <ProductListingPage /> },
            { path: "products/:id", element: <ProductDetailsPage /> },

            // shopper-only pages
            {
                element: <RequireAuth role="USER" />,
                children: [
                    { path: "cart", element: <CartPage /> },
                    { path: "checkout-result", element: <PostCheckoutPage /> },
                    { path: "orders", element: <OrdersPage /> },
                ],
            },

            // admin-only pages
            {
                element: <RequireAuth role="ADMIN" />,
                children: [
                    { path: "catalog", element: <ProductCatalogPage /> },
                    { path: "add-product", element: <AddProductPage /> },
                ],
            },
        ],
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "*", element: <ErrorPage /> },
];

const router = createBrowserRouter(routes);

export default router;
