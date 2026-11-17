import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { getErrorMessage } from "../utils/errors";
import { useSignupMutation } from "../features/auth/authApi";

export default function SignupPage() {
    const navigate = useNavigate();

    const [signup, { isLoading }] = useSignupMutation();

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER",
    });

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await signup(form).unwrap();
            navigate("/login");
        } catch (err) {
            setError(getErrorMessage(err, "Signup failed."));
        }
    };

    return (
        <section className="auth-container">
            <h2>Create Account</h2>

            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />

                <label>Password (8-20 characters)</label>
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    minLength={8}
                    maxLength={20}
                    required
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                    }
                    minLength={8}
                    maxLength={20}
                    required
                />

                <label>Account Type</label>
                <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="USER">Customer</option>
                    <option value="ADMIN">Admin</option>
                </select>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="primary-btn" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                </button>
            </form>

            <p>
                Already registered? <Link to="/login">Login</Link>
            </p>
        </section>
    );
}
