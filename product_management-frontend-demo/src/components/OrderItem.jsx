import { formatPrice } from "../utils/errors";

export default function OrderItem({ order }) {
    return (
        <div className="order-card">
            <div className="order-header">
                <h3>Order #{order.id}</h3>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <p className="order-meta">
                {order.paymentMode?.replaceAll("_", " ")} · Payment {order.paymentStatus} ·{" "}
                {order.deliveryStatus?.replaceAll("_", " ")}
            </p>

            <div className="order-products">
                {order.items?.map((item, index) => (
                    <div key={index} className="order-product">
                        <div>
                            <h4>{item.productName}</h4>
                            <p>
                                Quantity: {item.quantity} × {formatPrice(item.price)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <h3>Total: {formatPrice(order.totalAmount)}</h3>
        </div>
    );
}
