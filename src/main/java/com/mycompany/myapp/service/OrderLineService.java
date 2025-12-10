package com.mycompany.myapp.service;

import com.mycompany.myapp.repository.OrderLineRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderLineService {

    private final OrderLineRepository orderLineRepository;

    public OrderLineService(OrderLineRepository orderLineRepository) {
        this.orderLineRepository = orderLineRepository;
    }

    @Transactional(readOnly = true)
    public List<Long> getPurchasedProductIdsByUser(Long userId) {
        return orderLineRepository.findAllBuyedProductIdsByUser(userId);
    }

    @Transactional(readOnly = true)
    public Boolean hasUserPurchasedProduct(long userId, long productId) {
        return orderLineRepository.hasUserPurchasedProduct(userId, productId);
    }
}
