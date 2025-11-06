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
}
