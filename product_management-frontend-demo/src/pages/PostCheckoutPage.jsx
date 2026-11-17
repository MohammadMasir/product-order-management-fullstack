import { Link, Navigate, useLocation } from "react-router";
import { CheckCircle, XCircle } from "lucide-react";

import { formatPrice } from "../utils/errors";

export default function PostCheckoutPage() {
    const { state } = useLocation();

    if (!state) return <Navigate to="/orders" replace />;

    if (state.success) {
        const order = state.order;

        return (
            <section className="checkout-result success">
                <CheckCircle size={65} />

                <h2>Order Placed Successfully!</h2>

                {order?.id && <p>Order ID: {order.id}</p>}
                {order?.totalAmount != null && (
                    <p>Total paid/payable: {formatPrice(order.totalAmount)}</p>
                )}

                <ul>
                    {order?.cartProductDetailsDtoList?.map((p, i) => (
                        <li key={i}>
                            {p.productName} × {p.quantity}
                        </li>
                    ))}
                </ul>

                <Link to="/orders" className="primary-btn">
                    View Orders
                </Link>
            </section>
        );
    }

    return (
        <section className="checkout-result failed">
            <XCircle size={65} />

            <h2>Checkout Failed</h2>

            <p>{state.error || "Unable to complete checkout."}</p>

            <Link to="/cart" className="primary-btn">
                Return to Cart
            </Link>
        </section>
    );
}
