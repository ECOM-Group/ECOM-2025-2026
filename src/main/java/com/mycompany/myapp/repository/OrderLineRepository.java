package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.OrderLine;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OrderLine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
    @EntityGraph(attributePaths = "product")
    List<OrderLine> findByProdOrderId(Long id);

    @Query(
        value = """
            SELECT DISTINCT ol.product_id
            FROM prod_order po, order_line ol
            WHERE po.user_id = :userId AND po.valid AND po.id = ol.prod_order_id
        """,
        nativeQuery = true
    )
    List<Long> findAllBuyedProductIdsByUser(@Param("userId") Long userId);

    @Query(
        value = """
            SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END
            FROM prod_order po
            JOIN order_line ol ON po.id = ol.prod_order_id
            WHERE po.user_id = :userId
            AND po.valid = true
            AND ol.product_id = :productId
        """,
        nativeQuery = true
    )
    Boolean hasUserPurchasedProduct(@Param("userId") Long userId, @Param("productId") Long productId);
}
