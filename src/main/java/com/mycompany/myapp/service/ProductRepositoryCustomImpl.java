package com.mycompany.myapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.mycompany.myapp.domain.Product;
import com.mycompany.myapp.repository.ProductRepository;
import com.mycompany.myapp.repository.ProductRepositoryCustom;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class ProductRepositoryCustomImpl implements ProductRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Product> findByKeywords(List<String> keywords){
        if (keywords == null || keywords.isEmpty()) {
            return entityManager.createQuery("SELECT p FROM Product p", Product.class).getResultList();
        }

        String base = "SELECT p FROM Product p WHERE ";
        String where = keywords.stream()
            .map(k -> "(LOWER(p.name) LIKE :k_" + k.hashCode() +
                      " OR LOWER(p.desc) LIKE :k_" + k.hashCode() + ")")
            .collect(Collectors.joining(" AND "));

        Query query = entityManager.createQuery(base + where, Product.class);

        for (String k : keywords) {
            query.setParameter("k_" + k.hashCode(), "%" + k.toLowerCase() + "%");
        }

        return query.getResultList();
    }
}