package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Tag;
import com.mycompany.myapp.repository.ProductTagRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductTagService {

    private final ProductTagRepository repository;

    public ProductTagService(ProductTagRepository repository) {
        this.repository = repository;
    }

    public void addTagsToProduct(Long productId, List<Long> tagIds) {
        for (Long tagId : tagIds) {
            repository.addTagToProduct(productId, tagId);
        }
    }

    @Transactional(readOnly = true)
    public List<Tag> getTagsByProduct(Long productId) {
        return repository.findTagsForProduct(productId);
    }

    @Transactional(readOnly = true)
    public List<Long> getProductIdsByTag(Long tagId) {
        return repository.findProductIdsForTag(tagId);
    }
}
