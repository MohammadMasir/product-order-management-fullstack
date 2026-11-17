import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import {
    useGetAdminProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useUpdateProductStatusMutation,
} from "../features/products/productApi";
import { getErrorMessage } from "../utils/errors";

const emptyForm = {
    name: "",
    price: "",
    quantity: "",
    productStatus: "ENABLE",
};

function ProductForm({ existing }) {
    const navigate = useNavigate();
    const isEdit = Boolean(existing);

    const [addProduct, { isLoading: adding }] = useAddProductMutation();
    const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
    const [updateStatus] = useUpdateProductStatusMutation();

    const [form, setForm] = useState(
        existing
            ? {
                name: existing.name,
                price: existing.price,
                quantity: existing.quantity,
                productStatus: existing.productStatus,
            }
            : emptyForm
    );
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const payload = {
            name: form.name,
            price: Number(form.price),
            quantity: Number(form.quantity),
        };

        try {
            if (isEdit) {
                await updateProduct({ id: existing.id, ...payload }).unwrap();

                if (form.productStatus !== existing.productStatus) {
                    await updateStatus({
                        id: existing.id,
                        status: form.productStatus,
                    }).unwrap();
                }
            } else {
                await addProduct({ ...payload, productStatus: form.productStatus }).unwrap();
            }

            navigate("/catalog");
        } catch (err) {
            setError(getErrorMessage(err, "Product save failed."));
        }
    };

    return (
        <section className="form-container">
            <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>

            <form onSubmit={handleSubmit}>
                <label>Product Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />

                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <label>Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    min="1"
                    step="1"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                />

                <label>Status</label>
                <select
                    name="productStatus"
                    value={form.productStatus}
                    onChange={handleChange}
                >
                    <option value="ENABLE">ENABLE</option>
                    <option value="DISABLE">DISABLE</option>
                </select>

                {error && <p className="error-message">{error}</p>}

                <button
                    type="submit"
                    className="primary-btn"
                    disabled={adding || updating}
                >
                    {adding || updating
                        ? "Saving..."
                        : isEdit
                            ? "Update Product"
                            : "Save Product"}
                </button>
            </form>
        </section>
    );
}

export default function AddProductPage() {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("id");

    const { data: products = [], isLoading } = useGetAdminProductsQuery(undefined, {
        skip: !editId,
    });

    if (!editId) return <ProductForm />;
    if (isLoading) return <p>Loading product...</p>;

    const existing = products.find((p) => String(p.id) === editId);
    if (!existing) return <p>Product not found.</p>;

    return <ProductForm key={existing.id} existing={existing} />;
}
