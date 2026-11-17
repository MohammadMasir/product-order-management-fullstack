import { useGetProductsQuery } from "../features/products/productApi";
import ProductItem from "../components/ProductItem";

export default function ProductListingPage() {
    const { data: products = [], isLoading, isError } = useGetProductsQuery();

    if (isLoading) return <p>Loading products...</p>;
    if (isError) return <p>Unable to load products.</p>;

    return (
        <section>
            <h2>Our Products</h2>

            <div className="product-grid">
                {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>

            {products.length === 0 && <p>No products available.</p>}
        </section>
    );
}
