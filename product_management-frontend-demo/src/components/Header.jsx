import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { ShoppingCart } from "lucide-react";

import { baseApi } from "../apis/baseApi";
import useAuth from "../hooks/useAuth";
import { useLogoutMutation } from "../features/auth/authApi";
import { useGetCartQuery } from "../features/cart/cartApi";

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAdmin, isUser } = useAuth();
    const [logout] = useLogoutMutation();

    // Only normal users have a cart on the backend
    const { data: cart } = useGetCartQuery(undefined, { skip: !isUser });

    const cartCount =
        cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) ?? 0;

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch {
            // session may be ended
        }
        navigate("/login");
        dispatch(baseApi.util.resetApiState());
    };

    return (
        <header className="header">
            <Link to="/" className="logo">
                <span>ShopEase</span>
            </Link>

            <nav className="nav-links">
                <Link to="/">Products</Link>
                {isUser && <Link to="/orders">Orders</Link>}
                {isAdmin && <Link to="/catalog">Catalog</Link>}
                {isAdmin && (
                    <Link to="/add-product" className="add-product-btn">
                        + Add Product
                    </Link>
                )}
            </nav>

            <div className="header-right">
                {isUser && (
                    <Link to="/cart" className="cart-link">
                        <ShoppingCart size={25} />
                        <span className="cart-count">{cartCount}</span>
                    </Link>
                )}

                {user ? (
                    <>
                        <span className="user-email">
                            {user.email} ({user.role})
                        </span>
                        <button className="secondary-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    );
}
