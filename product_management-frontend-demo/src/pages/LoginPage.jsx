import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { getErrorMessage } from "../utils/errors";
import {
    useLoginMutation,
    useLazyGetCurrentUserQuery,
} from "../features/auth/authApi";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [login, { isLoading }] = useLoginMutation();
    const [fetchMe] = useLazyGetCurrentUserQuery();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(form).unwrap();

            const me = await fetchMe(undefined, false).unwrap();

            const from = location.state?.from;
            navigate(from ?? (me.role === "ADMIN" ? "/catalog" :"/" ), { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, "Login failed."));
        }
    };

    return (
        <section className="auth-container">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    minLength={8}
                    maxLength={20}
                    required
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="primary-btn" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p>
                Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </section>
    );
}
