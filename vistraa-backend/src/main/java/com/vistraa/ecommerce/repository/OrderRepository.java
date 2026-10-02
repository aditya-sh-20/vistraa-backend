package com.vistraa.ecommerce.repository;

import com.vistraa.ecommerce.model.Order;
import com.vistraa.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByTransactionOrderId(String transactionOrderId);

    List<Order> findByUserOrderByCreatedAtDesc(User user);
}