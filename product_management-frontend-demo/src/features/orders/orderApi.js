import { baseApi } from "../../apis/baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => "/orders",
            providesTags: ["Order"],
        }),
    }),
});

export const { useGetOrdersQuery } = orderApi;
