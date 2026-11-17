package com.interview.product_management.dto.product;

import com.interview.product_management.enums.orders.DeliveryStatus;
import com.interview.product_management.enums.orders.PaymentMode;
import com.interview.product_management.enums.orders.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderSummaryDto(
        Long id,
        LocalDateTime createdAt,
        BigDecimal totalAmount,
        Integer itemCount,
        PaymentMode paymentMode,
        PaymentStatus paymentStatus,
        DeliveryStatus deliveryStatus,
        List<OrderLineDto> items
) {
}
