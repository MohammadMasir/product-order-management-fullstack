import { useNavigate } from "react-router";

import useAuth from "../hooks/useAuth";
import { getErrorMessage } from "../utils/errors";
import {
    useAddToCartMutation,
    useGetCartQuery,
} from "../features/cart/cartApi";

export default function AddToCartButton({ product }) {
    const navigate = useNavigate();
    const { user, isAdmin, isUser } = useAuth();

    const { data: cart } = useGetCartQuery(undefined, { skip: !isUser });
    const [addToCart, { isLoading, error }] = useAddToCartMutation();

    // Admins manage products, they don't shop
    if (isAdmin) return null;

    const isAdded =
        cart?.cartItems?.some((item) => item.productId === product.id) ?? false;
    const outOfStock = product.quantity <= 0;

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            await addToCart(product.id).unwrap();
        } catch {
            // message is rendered from `error` below
        }
    };

    return (
        <>
            <button
                disabled={isAdded || isLoading || outOfStock}
                className={isAdded ? "added-btn" : "primary-btn"}
                onClick={handleAddToCart}
            >
                {outOfStock
                    ? "Out of stock"
                    : isAdded
                        ? "Added"
                        : isLoading
                            ? "Adding..."
                            : "Add To Cart"}
            </button>

            {error && <p className="error-message">{getErrorMessage(error)}</p>}
        </>
    );
}
