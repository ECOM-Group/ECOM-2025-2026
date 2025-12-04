package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Tag;
import com.mycompany.myapp.service.ProductTagService;
import jakarta.transaction.Transactional;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products-tags")
public class ProductTagResource {

    private final Logger log = LoggerFactory.getLogger(ProductTagResource.class);
    private final ProductTagService service;

    public ProductTagResource(ProductTagService service) {
        this.service = service;
    }

    // Attach tags to a product
    @PostMapping("/{productId}/tags")
    @Transactional
    public ResponseEntity<Void> addTags(@PathVariable Long productId, @RequestBody List<Long> tagIds) {
        log.info("Attaching tags {} to product {}", tagIds, productId);
        service.addTagsToProduct(productId, tagIds);
        return ResponseEntity.ok().build();
    }

    // Get tags of a product
    @GetMapping("/{productId}/tags")
    public List<Tag> getTags(@PathVariable Long productId) {
        return service.getTags(productId);
    }

    // New endpoint: Get product IDs associated with a tag
    @GetMapping("/by-tag/{tagId}/product-ids")
    public List<Long> getProductIdsByTag(@PathVariable Long tagId) {
        log.info("Fetching product IDs for tag {}", tagId);
        return service.getProductIdsByTag(tagId);
    }
}
