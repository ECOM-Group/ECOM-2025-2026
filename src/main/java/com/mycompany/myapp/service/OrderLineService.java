package com.mycompany.myapp.service;

import com.mycompany.myapp.repository.OrderLineRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class OrderLineService {

    private final OrderLineRepository orderLineRepository;

    public OrderLineService(OrderLineRepository orderLineRepository) {
        this.orderLineRepository = orderLineRepository;
    }

    public List<Long> getPurchasedProductIdsByUser(Long userId) {
        return orderLineRepository.findAllBuyedProductIdsByUser(userId);
    }

    public Boolean hasUserPurchasedProduct(long userId, long productId) {
        return orderLineRepository.hasUserPurchasedProduct(userId, productId);
    }
}
