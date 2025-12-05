package com.mycompany.myapp.repository;

import com.mycompany.myapp.config.WebConfigurer;
import com.mycompany.myapp.domain.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

@Repository
public class ProductRepositoryCustomImpl implements ProductRepositoryCustom {

    private static final Logger LOG = LoggerFactory.getLogger(WebConfigurer.class);

    @PersistenceContext
    private EntityManager entityManager;

    @SuppressWarnings("unchecked")
    @Override
    public List<Product> findByKeywords(List<String> keywords) {
        LOG.info("Function findByKeywords called with keywords: {}", keywords);

        if (keywords == null || keywords.isEmpty()) {
            return entityManager.createQuery("SELECT p FROM Product p", Product.class).getResultList();
        }

        String base = "SELECT p FROM Product p WHERE ";
        String where = keywords
            .stream()
            .map(k -> "(LOWER(p.name) LIKE '%" + k.toLowerCase() + "%' " + "OR LOWER(p.desc) LIKE '%" + k.toLowerCase() + "%')")
            .collect(Collectors.joining(" OR "));

        String finalQuery = base + where;
        LOG.info("Constructed JPQL query: {}", finalQuery);

        Query query = entityManager.createQuery(finalQuery, Product.class);
        return query.getResultList();
    }

    public List<Product> findAlikeProducts(Long productId, int limit) {
        LOG.info("Function findAlikeProducts called with productId: {} and limit: {}", productId, limit);

        String jpql = "SELECT p FROM Product p WHERE p.id <> :productId ORDER BY FUNCTION('RAND')";
        Query query = entityManager.createQuery(jpql, Product.class);
        query.setParameter("productId", productId);
        query.setMaxResults(limit);

        return query.getResultList();
    }
}
