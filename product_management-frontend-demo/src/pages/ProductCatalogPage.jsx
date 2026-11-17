import { Link } from "react-router";

import {
    useGetAdminProductsQuery,
    useUpdateProductStatusMutation,
} from "../features/products/productApi";
import { formatPrice, getErrorMessage } from "../utils/errors";

export default function ProductCatalogPage() {
    const { data: products = [], isLoading, isError } = useGetAdminProductsQuery();
    const [updateStatus, { error }] = useUpdateProductStatusMutation();

    const handleStatusChange = async (id, status) => {
        try {
            await updateStatus({ id, status }).unwrap();
        } catch {
         //
        }
    };

    if (isLoading) return <p>Loading catalog...</p>;
    if (isError) return <p>Unable to load catalog.</p>;

    return (
        <section>
            <div className="page-heading">
                <h2>Product Catalog</h2>

                <Link to="/add-product" className="primary-btn">
                    + Add Product
                </Link>
            </div>

            {error && <p className="error-message">{getErrorMessage(error)}</p>}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>
                                    <select
                                        value={product.productStatus}
                                        onChange={(e) =>
                                            handleStatusChange(product.id, e.target.value)
                                        }
                                    >
                                        <option value="ENABLE">ENABLE</option>
                                        <option value="DISABLE">DISABLE</option>
                                    </select>
                                </td>
                                <td>{formatPrice(product.price)}</td>
                                <td>{product.quantity}</td>
                                <td className="actions">
                                    <td>
                                        <Link to={`/add-product?id=${product.id}`} style={ {boxShadow: 'none', textShadow: 'none', textDecoration: 'none'} }>Edit</Link>
                                    </td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && <p>No products found.</p>}
            </div>
        </section>
    );
}
