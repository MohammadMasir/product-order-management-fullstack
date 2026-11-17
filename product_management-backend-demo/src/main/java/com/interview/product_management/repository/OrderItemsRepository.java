package com.interview.product_management.repository;

import com.interview.product_management.model.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemsRepository extends JpaRepository<OrderItems, Long> {

    List<OrderItems> findAllByOrders_Id(Long ordersId);
}
