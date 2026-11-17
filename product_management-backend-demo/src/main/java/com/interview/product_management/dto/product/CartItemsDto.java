package com.interview.product_management.dto.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CartItemsDto(
        @NotNull(message = "CartItems itemId cannot be null!")
        Long itemId,

        @NotNull(message = "ProductId cannot be null!")
        Long productId,

        @NotNull(message = "Quantity cannot be null!")
        @Min(value = 0, message = "Quantity cannot be negative!")
        Integer quantity
){
        public CartItemsDto(
                @NotNull(message = "ProductId cannot be null!")
                Long productId,

                @NotNull(message = "Quantity cannot be null!")
                @Min(value = 0, message = "Quantity cannot be negative!")
                Integer quantity
        ){
                this(0L, productId, quantity);
        }
}