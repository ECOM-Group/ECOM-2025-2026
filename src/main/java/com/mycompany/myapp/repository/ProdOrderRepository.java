package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ProdOrder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProdOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProdOrderRepository extends JpaRepository<ProdOrder, Long> {
    @Query("select prodOrder from ProdOrder prodOrder where prodOrder.user.login = ?#{authentication.name}")
    List<ProdOrder> findByUserIsCurrentUser();

    @Query("select prodOrder from ProdOrder prodOrder where prodOrder.user.login = ?#{authentication.name} and valid=false")
    ProdOrder findInvalidByUserIsCurrentUser();
}
