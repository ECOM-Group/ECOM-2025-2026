package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Product;
import jakarta.persistence.LockModeType;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id IN :ids")
    List<Product> findAllForUpdate(@Param("ids") List<Long> ids);
}
