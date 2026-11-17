import { Link } from "react-router";

export default function ErrorPage() {
    return (
        <section className="checkout-result failed">
            <h2>Oops! Something went wrong.</h2>
            <Link to="/" className="primary-btn">
                Back to Home
            </Link>
        </section>
    );
}
