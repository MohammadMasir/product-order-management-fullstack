package com.interview.product_management.dto.product;

import java.math.BigDecimal;

public record OrderLineDto(
        String productName,
        Integer quantity,
        BigDecimal price
) {
}
