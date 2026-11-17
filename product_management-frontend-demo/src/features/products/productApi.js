import { baseApi } from "../../apis/baseApi";

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Public: only ENABLE products come back from the backend
        getProducts: builder.query({
            query: () => "/product",
            providesTags: ["Product"],
        }),

        getProductById: builder.query({
            query: (id) => `/product/${id}`,
            providesTags: (result, error, id) => [{ type: "Product", id }, "Product"],
        }),

        // Admin: every product, including DISABLE ones
        getAdminProducts: builder.query({
            query: () => "/admin/product",
            providesTags: ["AdminProduct"],
        }),

        addProduct: builder.mutation({
            query: (product) => ({
                url: "/admin/product/add",
                method: "POST",
                body: product,
            }),
            invalidatesTags: ["Product", "AdminProduct"],
        }),

        updateProduct: builder.mutation({
            query: (product) => ({
                url: "/admin/product/update",
                method: "PUT",
                body: product,
            }),
            invalidatesTags: ["Product", "AdminProduct"],
        }),

        // status: "ENABLE" | "DISABLE"  (sent as ?productStatus=)
        updateProductStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/product/${id}/editStatus`,
                method: "PUT",
                params: { productStatus: status },
            }),
            invalidatesTags: ["Product", "AdminProduct"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetAdminProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useUpdateProductStatusMutation,
} = productApi;
