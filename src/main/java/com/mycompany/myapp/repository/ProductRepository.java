package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Product;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Product entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(
        """
            SELECT ol.product
            FROM OrderLine ol
            GROUP BY ol.product
            ORDER BY SUM(ol.quantity) DESC
        """
    )
    List<Product> findTopProductsBySales(Pageable pageable);

    public List<Product> findByKeywords(List<String> keywords) {
    String base = "SELECT p FROM Product p WHERE ";
    String where = keywords.stream()
        .map(k -> "(LOWER(p.title) LIKE :k_" + k.hashCode() + " OR LOWER(p.description) LIKE :k_" + k.hashCode() + ")")
        .collect(Collectors.joining(" AND "));

    Query query = entityManager.createQuery(base + where, Product.class);

    for (String k : keywords) {
        query.setParameter("k_" + k.hashCode(), "%" + k.toLowerCase() + "%");
    }

    return query.getResultList();
}
}
