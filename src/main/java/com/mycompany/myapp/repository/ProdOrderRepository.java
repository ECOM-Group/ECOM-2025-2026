package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ProdOrder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Modifying
    @Query("delete from ProdOrder p where p.user.id = :userId and p.valid = false")
    void deleteCartByUser(@Param("userId") Long userId);

    @Modifying
    @Query("update ProdOrder p set p.user = null where p.user.id = :userId and p.valid = true")
    void clearUserFromValidatedOrders(@Param("userId") Long userId);

    List<ProdOrder> findByUserIdAndValid(Long userId, Boolean valid);
}
