package com.mycompany.myapp.repository;

import java.util.List;
import com.mycompany.myapp.domain.Product;

public interface ProductRepositoryCustom {
    List<Product> findByKeywords(List<String> keywords);
}
