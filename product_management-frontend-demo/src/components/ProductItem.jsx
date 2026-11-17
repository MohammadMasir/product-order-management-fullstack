import { Link } from "react-router";

import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "../utils/errors";

export default function ProductItem({ product }) {
    return (
        <div className="product-card">
            <Link to={`/products/${product.id}`}>
                <div className="product-img">{product.name?.charAt(0)}</div>
                <h3>{product.name}</h3>
            </Link>

            <p className="price">{formatPrice(product.price)}</p>
            <p className="stock">
                {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
            </p>

            <AddToCartButton product={product} />
        </div>
    );
}
