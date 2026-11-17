package com.interview.product_management.service;

import com.interview.product_management.dto.product.CartItemsDto;
import com.interview.product_management.dto.product.CartProductDetailsDto;
import com.interview.product_management.dto.product.OrderDetailsDto;
import com.interview.product_management.dto.product.OrderDto;
import com.interview.product_management.dto.product.OrderLineDto;
import com.interview.product_management.dto.product.OrderSummaryDto;
import com.interview.product_management.exceptions.ResourceNotFoundException;
import com.interview.product_management.model.*;
import com.interview.product_management.repository.CartItemsRepository;
import com.interview.product_management.repository.OrderItemsRepository;
import com.interview.product_management.repository.OrderRepository;
import com.interview.product_management.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final OrderItemsRepository orderItemsRepository;
    private final ProductRepository productRepository;
    private final CartItemsRepository cartItemsRepository;

    @Transactional
    public OrderDetailsDto createOrder(OrderDto orderDto, User user, Long cartId, BigDecimal totalAmount) {
        Order order = new Order();

        order.setUsers(user);

        order.setPaymentMode(orderDto.paymentMode());
        order.setPaymentStatus(orderDto.paymentStatus());
        order.setDeliveryStatus(orderDto.deliveryStatus());

        List<CartItems> cartItems = cartItemsRepository.findAllByCart_Id(cartId);
        order.setItemCount(cartItems.size());
        int totalQuantity = 0;
        for (CartItems cartItem : cartItems) {
            totalQuantity = totalQuantity + cartItem.getQuantity();
        }
        order.setTotalQuantity(totalQuantity);
        order.setTotalAmount(totalAmount);

        Order order1 = orderRepository.save(order);

        addOrderItems(order1.getId(), cartId);

        List<CartProductDetailsDto> cartProducts = cartItemsRepository.findAllByCart_Id(cartId).stream()
                .map(cartItems1 -> new CartProductDetailsDto(
                        cartItems1.getProduct().getName(),
                        cartItems1.getQuantity()
                )).toList();

        return new OrderDetailsDto(
                order1.getId(),
                cartProducts,
                order1.getItemCount(),
                totalAmount,
                orderDto.paymentMode(),
                orderDto.deliveryStatus(),
                orderDto.paymentStatus()
        );
    }

    public List<OrderSummaryDto> getOrdersByUser(Long userId) {
        return orderRepository.findAllByUsers_IdOrderByCreatedAtDesc(userId).stream()
                .map(order -> new OrderSummaryDto(
                        order.getId(),
                        order.getCreatedAt(),
                        order.getTotalAmount(),
                        order.getItemCount(),
                        order.getPaymentMode(),
                        order.getPaymentStatus(),
                        order.getDeliveryStatus(),
                        orderItemsRepository.findAllByOrders_Id(order.getId()).stream()
                                .map(item -> new OrderLineDto(
                                        item.getProduct().getName(),
                                        item.getQuantity(),
                                        item.getPrice()
                                ))
                                .toList()
                ))
                .toList();
    }

    @Transactional
    public void addOrderItems(Long orderId, Long cartId) {
        List<CartItems> cartItems = cartItemsRepository.findAllByCart_Id(cartId);
        Order savedOrder = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order NOT Found!"));

        for (CartItems cartItem : cartItems) {
            OrderItems orderItems = new OrderItems();
            orderItems.setOrders(savedOrder);
            orderItems.setProduct(cartItem.getProduct());
            orderItems.setQuantity(cartItem.getQuantity());
            orderItems.setPrice(cartItem.getProduct().getPrice());
            orderItemsRepository.save(orderItems);
        }

        for (CartItems cartItem : cartItems) {
            productService.buyProduct(cartItem.getProduct().getId(), cartItem.getQuantity());
        }
    }
}
