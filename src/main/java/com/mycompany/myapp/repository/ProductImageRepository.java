package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ProductImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductImage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);

    ProductImage findFirstByProductIdOrderByIdAsc(Long productId);
}
