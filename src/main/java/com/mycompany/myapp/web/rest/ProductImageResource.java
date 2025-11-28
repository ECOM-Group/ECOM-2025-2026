package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Product;
import com.mycompany.myapp.domain.ProductImage;
import com.mycompany.myapp.repository.ProductImageRepository;
import com.mycompany.myapp.repository.ProductRepository;
import com.mycompany.myapp.service.ImageUploadService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ProductImage}.
 */
@RestController
@RequestMapping("/api/product-images")
@Transactional
public class ProductImageResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProductImageResource.class);

    private static final String ENTITY_NAME = "productImage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductImageRepository productImageRepository;
    private final ImageUploadService imageUploadService;
    private final ProductRepository productRepository;

    public ProductImageResource(
        ProductImageRepository productImageRepository,
        ImageUploadService imageUploadService,
        ProductRepository productRepository
    ) {
        this.productImageRepository = productImageRepository;
        this.imageUploadService = imageUploadService;
        this.productRepository = productRepository;
    }

    /**
     * {@code POST  /product-images} : Create a new productImage.
     *
     * @param productImage the productImage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productImage, or with status {@code 400 (Bad Request)} if the productImage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ProductImage> createProductImage(@Valid @RequestBody ProductImage productImage) throws URISyntaxException {
        LOG.debug("REST request to save ProductImage : {}", productImage);
        if (productImage.getId() != null) {
            throw new BadRequestAlertException("A new productImage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        productImage = productImageRepository.save(productImage);
        return ResponseEntity.created(new URI("/api/product-images/" + productImage.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, productImage.getId().toString()))
            .body(productImage);
    }

    /**
     * {@code PUT  /product-images/:id} : Updates an existing productImage.
     *
     * @param id the id of the productImage to save.
     * @param productImage the productImage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productImage,
     * or with status {@code 400 (Bad Request)} if the productImage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productImage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductImage> updateProductImage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProductImage productImage
    ) throws URISyntaxException {
        LOG.debug("REST request to update ProductImage : {}, {}", id, productImage);
        if (productImage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productImage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productImageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        productImage = productImageRepository.save(productImage);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productImage.getId().toString()))
            .body(productImage);
    }

    /**
     * {@code PATCH  /product-images/:id} : Partial updates given fields of an existing productImage, field will ignore if it is null
     *
     * @param id the id of the productImage to save.
     * @param productImage the productImage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productImage,
     * or with status {@code 400 (Bad Request)} if the productImage is not valid,
     * or with status {@code 404 (Not Found)} if the productImage is not found,
     * or with status {@code 500 (Internal Server Error)} if the productImage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductImage> partialUpdateProductImage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProductImage productImage
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ProductImage partially : {}, {}", id, productImage);
        if (productImage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productImage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productImageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductImage> result = productImageRepository
            .findById(productImage.getId())
            .map(existingProductImage -> {
                if (productImage.getUrl() != null) {
                    existingProductImage.setUrl(productImage.getUrl());
                }

                return existingProductImage;
            })
            .map(productImageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productImage.getId().toString())
        );
    }

    /**
     * {@code GET  /product-images} : get all the productImages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productImages in body.
     */
    @GetMapping("")
    public List<ProductImage> getAllProductImages() {
        LOG.debug("REST request to get all ProductImages");
        return productImageRepository.findAll();
    }

    /**
     * {@code GET  /product-images/:id} : get the "id" productImage.
     *
     * @param id the id of the productImage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productImage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductImage> getProductImage(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ProductImage : {}", id);
        Optional<ProductImage> productImage = productImageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productImage);
    }

    /**
     * {@code DELETE  /product-images/:id} : delete the "id" productImage.
     *
     * @param id the id of the productImage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ProductImage : {}", id);
        productImageRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping("/upload")
    public ResponseEntity<ProductImage> uploadProductImage(
        @RequestParam("file") MultipartFile file,
        @RequestParam("productId") Long productId
    ) throws Exception {
        // 1. Upload de l’image vers Cloudinary → retourne une URL
        String url = imageUploadService.upload(file);

        // 2. On récupère le produit concerné
        Product product = productRepository.findById(productId).orElseThrow();

        // 3. On crée une nouvelle ProductImage
        ProductImage image = new ProductImage();
        image.setUrl(url);
        image.setProduct(product);

        // 4. On sauvegarde
        ProductImage saved = productImageRepository.save(image);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/first-by-product/{productId}")
    public ResponseEntity<ProductImage> getFirstImageByProduct(@PathVariable Long productId) {
        Optional<ProductImage> image = productImageRepository
            .findAll()
            .stream()
            .filter(img -> img.getProduct() != null) // éviter les NPE
            .filter(img -> productId.equals(img.getProduct().getId()))
            .findFirst();

        return ResponseUtil.wrapOrNotFound(image);
    }

    @GetMapping("/by-product/{productId}")
    public List<ProductImage> getImagesByProduct(@PathVariable Long productId) {
        return productImageRepository.findByProductId(productId);
    }
}
