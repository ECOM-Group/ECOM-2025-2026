package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Product;
import com.mycompany.myapp.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductServiceImpl {

    private final EntityManager entityManager;
    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository, EntityManager entityManager) {
        this.productRepository = productRepository;
        this.entityManager = entityManager;
    }

    public List<Product> findByKeywords(List<String> keywords) {
        if (keywords == null || keywords.isEmpty()) {
            return productRepository.findAll(); //pas sur que ce soit top
        }

        String base = "SELECT p FROM Product p WHERE ";
        String where = keywords
            .stream()
            .map(k -> "(LOWER(p.name) LIKE :k_" + k.hashCode() + " OR LOWER(p.desc) LIKE :k_" + k.hashCode() + ")")
            .collect(Collectors.joining(" AND "));

        Query query = entityManager.createQuery(base + where, Product.class);

        for (String k : keywords) {
            query.setParameter("k_" + k.hashCode(), "%" + k.toLowerCase() + "%");
        }

        @SuppressWarnings("unchecked")
        List<Product> results = (List<Product>) query.getResultList();
        return results;
    }
}
