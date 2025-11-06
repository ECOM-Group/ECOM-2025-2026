package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.OrderLine;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OrderLine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
    @EntityGraph(attributePaths = "product")
    List<OrderLine> findByProdOrderId(Long prodOrderId);
}
