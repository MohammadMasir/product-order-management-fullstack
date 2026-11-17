import { useParams } from "react-router";

import { useGetProductByIdQuery } from "../features/products/productApi";
import AddToCartButton from "../components/AddToCartButton";
import { formatPrice } from "../utils/errors";

export default function ProductDetailsPage() {
    const { id } = useParams();

    const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

    if (isLoading) return <p>Loading product...</p>;
    if (isError || !product) return <p>Product not found.</p>;

    return (
        <section className="product-details">
            <div className="product-img large">{product.name?.charAt(0)}</div>

            <div>
                <h2>{product.name}</h2>
                <h3>{formatPrice(product.price)}</h3>
                <p>
                    {product.quantity > 0
                        ? `${product.quantity} in stock`
                        : "Out of stock"}
                </p>

                <AddToCartButton product={product} />
            </div>
        </section>
    );
}
