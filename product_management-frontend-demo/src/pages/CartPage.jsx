import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useGetCartQuery, useCheckoutMutation } from "../features/cart/cartApi";
import { useGetProductsQuery } from "../features/products/productApi";
import CartItem from "../components/CartItem";
import { formatPrice, getErrorMessage } from "../utils/errors";

const PAYMENT_MODES = [
    { value: "CASH_ON_DELIVERY", label: "Cash on delivery", paymentStatus: "PENDING" },
    { value: "UPI", label: "UPI", paymentStatus: "DONE" },
    { value: "CARD_PAYMENT", label: "Card", paymentStatus: "DONE" },
];

export default function CartPage() {
    const navigate = useNavigate();
    const [paymentMode, setPaymentMode] = useState("CASH_ON_DELIVERY");

    const { data: cart, isLoading, isError } = useGetCartQuery();
    const { data: products = [] } = useGetProductsQuery();
    const [checkout, { isLoading: checkingOut }] = useCheckoutMutation();

    const handleCheckout = async () => {
        const mode = PAYMENT_MODES.find((m) => m.value === paymentMode);

        try {
            const order = await checkout({
                paymentMode: mode.value,
                paymentStatus: mode.paymentStatus,
                deliveryStatus: "PROCESSING",
            }).unwrap();

            navigate("/checkout-result", { state: { success: true, order } });
        } catch (error) {
            navigate("/checkout-result", {
                state: {
                    success: false,
                    error: getErrorMessage(error, "Checkout failed. Please try again."),
                },
            });
        }
    };

    if (isLoading) return <p>Loading cart...</p>;
    if (isError) return <p>Unable to load cart.</p>;

    const items = cart?.cartItems ?? [];

    if (items.length === 0) {
        return (
            <section>
                <h2>Your Cart</h2>
                <p>Your cart is currently empty.</p>
                <Link to="/" className="primary-btn">
                    Browse products
                </Link>
            </section>
        );
    }

    return (
        <section>
            <h2>Your Cart</h2>

            <div className="cart-layout">
                <div className="cart-items">
                    {items.map((item) => (
                        <CartItem
                            key={item.itemId}
                            item={item}
                            product={products.find((p) => p.id === item.productId)}
                        />
                    ))}
                </div>

                <aside className="cart-summary">
                    <h3>Order Summary</h3>

                    <p>Total Amount: {formatPrice(cart.totalAmount)}</p>

                    <label>Payment Method</label>
                    <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        {PAYMENT_MODES.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>

                    <button
                        className="primary-btn"
                        disabled={checkingOut}
                        onClick={handleCheckout}
                    >
                        {checkingOut ? "Processing..." : "Proceed to Checkout"}
                    </button>
                </aside>
            </div>
        </section>
    );
}
