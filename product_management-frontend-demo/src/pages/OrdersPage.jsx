import { useGetOrdersQuery } from "../features/orders/orderApi";
import OrderItem from "../components/OrderItem";

export default function OrdersPage() {
    const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

    if (isLoading) return <p>Loading orders...</p>;
    if (isError) return <p>Unable to load orders.</p>;

    return (
        <section>
            <h2>My Orders</h2>

            {orders.length === 0 ? (
                <p>You haven&apos;t placed any orders yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <OrderItem key={order.id} order={order} />
                    ))}
                </div>
            )}
        </section>
    );
}
