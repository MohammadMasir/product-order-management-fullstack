import { baseApi } from "../../apis/baseApi";

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // -> { cartItems: [{ itemId, productId, quantity }], totalAmount }
        getCart: builder.query({
            query: () => "/cart",
            providesTags: ["Cart"],
        }),

        addToCart: builder.mutation({
            query: (productId) => ({
                url: `/cart/${productId}`,
                method: "POST",
            }),
            invalidatesTags: ["Cart"],
        }),

        // quantity 0 removes the item from the cart
        updateCartQuantity: builder.mutation({
            query: ({ itemId, productId, quantity }) => ({
                url: "/cart",
                method: "PATCH",
                body: { itemId, productId, quantity },
            }),
            invalidatesTags: ["Cart"],
        }),

        checkout: builder.mutation({
            query: (body) => ({
                url: "/cart/checkout",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart", "Order", "Product", "AdminProduct"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartQuantityMutation,
    useCheckoutMutation,
} = cartApi;
