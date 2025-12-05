package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Review;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Review entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("select review from Review review where review.user.login = ?#{authentication.name}")
    List<Review> findByUserIsCurrentUser();

    @Modifying
    @Query("update Review r set r.user = null where r.user.id = :userId")
    void clearUserFromReviews(@Param("userId") Long userId);

    @Query(
        value = """
            SELECT *
            FROM review r
            WHERE r.user_id = :userId
            AND r.product_id = :prodId
        """,
        nativeQuery = true
    )
    List<Review> getReviewByUserIdAndProductId(Long prodId, Long userId);
}
