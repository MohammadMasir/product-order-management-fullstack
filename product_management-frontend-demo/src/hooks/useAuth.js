import { useGetCurrentUserQuery } from "../features/auth/authApi";

// Source of truth is the backend session: GET /auth/me
export default function useAuth() {
    const { data, isLoading } = useGetCurrentUserQuery();

    return {
        user: data ?? null,
        isLoading,
        isAdmin: data?.role === "ADMIN",
        isUser: data?.role === "USER",
    };
}
