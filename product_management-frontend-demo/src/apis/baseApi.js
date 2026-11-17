import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",

    baseQuery: fetchBaseQuery({
        baseUrl: "/v1/api",
        credentials: "include",
    }),

    tagTypes: ["Product", "AdminProduct", "Cart", "Order"],

    endpoints: () => ({}),
});
