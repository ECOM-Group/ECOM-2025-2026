package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Product;
import java.util.List;

public interface ProductRepositoryCustom {
    List<Product> findByKeywords(List<String> keywords);
    List<Product> findAlikeProducts(Long productId, int limit);
}
