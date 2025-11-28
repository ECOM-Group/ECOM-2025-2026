package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Tag;
import com.mycompany.myapp.service.ProductTagService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductTagResource {

    private final ProductTagService service;

    public ProductTagResource(ProductTagService service) {
        this.service = service;
    }

    @PostMapping("/{productId}/tags")
    public ResponseEntity<Void> addTags(@PathVariable Long productId, @RequestBody List<Long> tagIds) {
        service.addTagsToProduct(productId, tagIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{productId}/tags")
    public List<Tag> getTags(@PathVariable Long productId) {
        return service.getTags(productId);
    }
}
