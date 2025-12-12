package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.OrderLine;
import com.mycompany.myapp.domain.ProdOrder;
import com.mycompany.myapp.domain.Product;
import com.mycompany.myapp.repository.OrderLineRepository;
import com.mycompany.myapp.repository.ProdOrderRepository;
import com.mycompany.myapp.repository.ProductRepository;
import com.mycompany.myapp.service.dto.MissingStockDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProdOrderService {

    private final ProductRepository productRepository;
    private final OrderLineRepository orderLineRepository;
    private final ProdOrderRepository prodOrderRepository;

    public ProdOrderService(
        ProductRepository productRepository,
        OrderLineRepository orderLineRepository,
        ProdOrderRepository prodOrderRepository
    ) {
        this.orderLineRepository = orderLineRepository;
        this.prodOrderRepository = prodOrderRepository;
        this.productRepository = productRepository;
    }

    public List<OrderLine> getOrderLinesByProdOrder(Long prodOrderId) {
        return orderLineRepository.findByProdOrderId(prodOrderId);
    }

    @Transactional
    public List<MissingStockDTO> finalizeOrder(ProdOrder order) {
        if (Boolean.TRUE.equals(order.getValid())) {
            throw new RuntimeException("Commande déjà validée");
        }

        // IDs des produits à verrouiller
        List<Long> productIds = order.getOrderLines().stream().map(line -> line.getProduct().getId()).toList();

        // Verrouillage pessimiste
        List<Product> lockedProducts = productRepository.findAllForUpdate(productIds);

        Map<Long, Product> productMap = lockedProducts.stream().collect(Collectors.toMap(Product::getId, p -> p));

        List<MissingStockDTO> missingStock = new ArrayList<>();

        for (OrderLine line : order.getOrderLines()) {
            Product product = productMap.get(line.getProduct().getId());
            int requested = line.getQuantity();
            int available = product.getQuantity();

            if (available < requested) {
                missingStock.add(new MissingStockDTO(product.getId(), product.getName(), requested, available));
            }
        }

        if (!missingStock.isEmpty()) {
            return missingStock;
        }

        // Déduire le stock
        for (OrderLine line : order.getOrderLines()) {
            Product product = productMap.get(line.getProduct().getId());
            product.setQuantity(product.getQuantity() - line.getQuantity());
            productRepository.save(product);
        }

        prodOrderRepository.save(order);

        return missingStock; // sera vide
    }

    public void confirmOrderPayment(ProdOrder order) {
        if (Boolean.TRUE.equals(order.getValid())) {
            throw new RuntimeException("Commande déjà validée");
        }

        order.setValid(true);
        prodOrderRepository.save(order);
    }

    @Transactional
    public void restoreOrderStock(ProdOrder order) {
        if (Boolean.TRUE.equals(order.getValid())) {
            throw new RuntimeException("Impossible de restaurer le stock d’une commande déjà validée");
        }

        List<Long> productIds = order.getOrderLines().stream().map(line -> line.getProduct().getId()).toList();

        List<Product> lockedProducts = productRepository.findAllForUpdate(productIds);

        Map<Long, Product> productMap = lockedProducts.stream().collect(Collectors.toMap(Product::getId, p -> p));

        for (OrderLine line : order.getOrderLines()) {
            Product product = productMap.get(line.getProduct().getId());
            product.setQuantity(product.getQuantity() + line.getQuantity());
            productRepository.save(product);
        }

        prodOrderRepository.save(order);
    }
}
