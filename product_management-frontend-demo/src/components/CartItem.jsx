import { Trash2 } from "lucide-react";

import { useUpdateCartQuantityMutation } from "../features/cart/cartApi";
import { formatPrice, getErrorMessage } from "../utils/errors";

// item: { itemId, productId, quantity } from the cart; product: matching product (may be missing)
export default function CartItem({ item, product }) {
    const [updateCart, { isLoading, error }] = useUpdateCartQuantityMutation();

    const name = product?.name ?? `Product #${item.productId}`;
    const price = Number(product?.price ?? 0);
    const stock = product?.quantity ?? Infinity;

    const setQuantity = async (quantity) => {
        try {
            await updateCart({
                itemId: item.itemId,
                productId: item.productId,
                quantity,
            }).unwrap();
        } catch {
            // message is rendered from `error` below
        }
    };

    return (
        <div className="cart-item">
            <div className="cart-item-details">
                <h3>{name}</h3>
                <p>{formatPrice(price)}</p>
                <p>Subtotal: {formatPrice(price * item.quantity)}</p>
                {error && <p className="error-message">{getErrorMessage(error)}</p>}
            </div>

            <div className="quantity-controls">
                <button
                    disabled={isLoading || item.quantity <= 1}
                    onClick={() => setQuantity(item.quantity - 1)}
                >
                    -
                </button>

                <span>{item.quantity}</span>

                <button
                    disabled={isLoading || item.quantity >= stock}
                    onClick={() => setQuantity(item.quantity + 1)}
                >
                    +
                </button>
            </div>

            <button
                className="delete-icon"
                onClick={() => setQuantity(0)}
                disabled={isLoading}
                aria-label="Remove item"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
}
