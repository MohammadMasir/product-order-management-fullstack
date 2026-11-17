import { baseApi } from "../../apis/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Same endpoint for users and admins (backend authenticates by email/password)
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
        }),

        // role: "USER" -> /auth/signup, "ADMIN" -> /admin/signup
        signup: builder.mutation({
            query: ({ role, ...body }) => ({
                url: role === "ADMIN" ? "/admin/signup" : "/auth/signup",
                method: "POST",
                body,
            }),
        }),

        logout: builder.mutation({
            query: () => ({ url: "/auth/logout", method: "POST" }),
        }),

        // -> { email, role }  (401 when not logged in)
        getCurrentUser: builder.query({
            query: () => "/auth/me",
            providesTags: ["Me"],
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useLazyGetCurrentUserQuery,
} = authApi;
