package com.interview.product_management.controller;

import com.interview.product_management.dto.product.OrderSummaryDto;
import com.interview.product_management.model.User;
import com.interview.product_management.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/api/orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderSummaryDto>> getMyOrders(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(orderService.getOrdersByUser(user.getId()), HttpStatus.OK);
    }

}
