package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.OrderLine;
import com.mycompany.myapp.repository.OrderLineRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ProdOrderService {

    private final OrderLineRepository orderLineRepository;

    public ProdOrderService(OrderLineRepository orderLineRepository) {
        this.orderLineRepository = orderLineRepository;
    }

    public List<OrderLine> getOrderLinesByProdOrder(Long prodOrderId) {
        return orderLineRepository.findByProdOrderId(prodOrderId);
    }
}
