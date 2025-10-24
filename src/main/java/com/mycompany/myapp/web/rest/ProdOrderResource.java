package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.OrderLine;
import com.mycompany.myapp.domain.ProdOrder;
import com.mycompany.myapp.repository.ProdOrderRepository;
import com.mycompany.myapp.service.ProdOrderService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
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
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ProdOrder}.
 */
@RestController
@RequestMapping("/api/prod-orders")
@Transactional
public class ProdOrderResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProdOrderResource.class);

    private static final String ENTITY_NAME = "prodOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProdOrderRepository prodOrderRepository;
    private final ProdOrderService prodOrderService;

    public ProdOrderResource(ProdOrderRepository prodOrderRepository, ProdOrderService prodOrderService) {
        this.prodOrderRepository = prodOrderRepository;
        this.prodOrderService = prodOrderService;
    }

    /**
     * {@code POST  /prod-orders} : Create a new prodOrder.
     *
     * @param prodOrder the prodOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new prodOrder, or with status {@code 400 (Bad Request)} if the prodOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ProdOrder> createProdOrder(@RequestBody ProdOrder prodOrder) throws URISyntaxException {
        LOG.debug("REST request to save ProdOrder : {}", prodOrder);
        if (prodOrder.getId() != null) {
            throw new BadRequestAlertException("A new prodOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        prodOrder = prodOrderRepository.save(prodOrder);
        return ResponseEntity.created(new URI("/api/prod-orders/" + prodOrder.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, prodOrder.getId().toString()))
            .body(prodOrder);
    }

    /**
     * {@code PUT  /prod-orders/:id} : Updates an existing prodOrder.
     *
     * @param id the id of the prodOrder to save.
     * @param prodOrder the prodOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prodOrder,
     * or with status {@code 400 (Bad Request)} if the prodOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the prodOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProdOrder> updateProdOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProdOrder prodOrder
    ) throws URISyntaxException {
        LOG.debug("REST request to update ProdOrder : {}, {}", id, prodOrder);
        if (prodOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prodOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!prodOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        prodOrder = prodOrderRepository.save(prodOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prodOrder.getId().toString()))
            .body(prodOrder);
    }

    /**
     * {@code PATCH  /prod-orders/:id} : Partial updates given fields of an existing prodOrder, field will ignore if it is null
     *
     * @param id the id of the prodOrder to save.
     * @param prodOrder the prodOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prodOrder,
     * or with status {@code 400 (Bad Request)} if the prodOrder is not valid,
     * or with status {@code 404 (Not Found)} if the prodOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the prodOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProdOrder> partialUpdateProdOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProdOrder prodOrder
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ProdOrder partially : {}, {}", id, prodOrder);
        if (prodOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prodOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!prodOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProdOrder> result = prodOrderRepository
            .findById(prodOrder.getId())
            .map(existingProdOrder -> {
                if (prodOrder.getValid() != null) {
                    existingProdOrder.setValid(prodOrder.getValid());
                }
                if (prodOrder.getPromo() != null) {
                    existingProdOrder.setPromo(prodOrder.getPromo());
                }

                return existingProdOrder;
            })
            .map(prodOrderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prodOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /prod-orders} : get all the prodOrders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of prodOrders in body.
     */
    @GetMapping("")
    public List<ProdOrder> getAllProdOrders() {
        LOG.debug("REST request to get all ProdOrders");
        return prodOrderRepository.findAll();
    }

    /**
     * {@code GET  /prod-orders/:id} : get the "id" prodOrder.
     *
     * @param id the id of the prodOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the prodOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProdOrder> getProdOrder(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ProdOrder : {}", id);
        Optional<ProdOrder> prodOrder = prodOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(prodOrder);
    }

    /**
     * {@code DELETE  /prod-orders/:id} : delete the "id" prodOrder.
     *
     * @param id the id of the prodOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProdOrder(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ProdOrder : {}", id);
        prodOrderRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/{id}/contents")
    public ResponseEntity<List<OrderLine>> getOrderLines(@PathVariable("id") Long id) {
        LOG.debug("REST request to consult lines ProdOrder : {}", id);
        List<OrderLine> lines = prodOrderService.getOrderLinesByProdOrder(id);
        if (lines.isEmpty()) {
            LOG.debug("No order lines found for ProdOrder id: {}", id);
            return ResponseEntity.noContent().build();
        }
        LOG.debug("Found {} order lines for ProdOrder id: {}", lines.size(), id);
        // Log each order line individually for detailed debugging
        lines.forEach(line -> LOG.debug("OrderLine: {}", line));
        return ResponseEntity.ok(lines);
    }
}
