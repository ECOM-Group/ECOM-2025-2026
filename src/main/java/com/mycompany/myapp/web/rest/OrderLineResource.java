package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.OrderLine;
import com.mycompany.myapp.repository.OrderLineRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.apache.http.HttpStatus;
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
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.OrderLine}.
 */
@RestController
@RequestMapping("/api/order-lines")
@Transactional
public class OrderLineResource {

    private static final Logger LOG = LoggerFactory.getLogger(OrderLineResource.class);

    private static final String ENTITY_NAME = "orderLine";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderLineRepository orderLineRepository;

    public OrderLineResource(OrderLineRepository orderLineRepository) {
        this.orderLineRepository = orderLineRepository;
    }

    /**
     * {@code POST  /order-lines} : Create a new orderLine.
     *
     * @param orderLine the orderLine to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderLine, or with status {@code 400 (Bad Request)} if the orderLine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<OrderLine> createOrderLine(@RequestBody OrderLine orderLine) throws URISyntaxException {
        LOG.debug("REST request to save OrderLine : {}", orderLine);
        if (orderLine.getId() != null) {
            throw new BadRequestAlertException("A new orderLine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        boolean conflic = false;
        if (
            orderLine.getProduct() != null &&
            orderLine.getProduct().getQuantity() != null &&
            orderLine.getQuantity() != null &&
            orderLine.getProduct().getQuantity() < orderLine.getQuantity()
        ) {
            orderLine.setQuantity(orderLine.getProduct().getQuantity());
            conflic = true;
        }
        orderLine.setTotal(orderLine.getQuantity() * orderLine.getUnitPrice());
        orderLine = orderLineRepository.save(orderLine);

        if (conflic) return ResponseEntity.status(HttpStatus.SC_CONFLICT).body(orderLine);
        return ResponseEntity.created(new URI("/api/order-lines/" + orderLine.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, orderLine.getId().toString()))
            .body(orderLine);
    }

    /**
     * {@code PUT  /order-lines/:id} : Updates an existing orderLine.
     *
     * @param id the id of the orderLine to save.
     * @param orderLine the orderLine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderLine,
     * or with status {@code 400 (Bad Request)} if the orderLine is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderLine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrderLine> updateOrderLine(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderLine orderLine
    ) throws URISyntaxException {
        LOG.debug("REST request to update OrderLine : {}, {}", id, orderLine);
        if (orderLine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderLine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderLineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        boolean conflic = false;
        if (
            orderLine.getProduct() != null &&
            orderLine.getProduct().getQuantity() != null &&
            orderLine.getQuantity() != null &&
            orderLine.getProduct().getQuantity() < orderLine.getQuantity()
        ) {
            orderLine.setQuantity(orderLine.getProduct().getQuantity());
            conflic = true;
        }
        orderLine.setTotal(orderLine.getQuantity() * orderLine.getUnitPrice());
        orderLine = orderLineRepository.save(orderLine);
        if (conflic) return ResponseEntity.status(HttpStatus.SC_CONFLICT).body(orderLine);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderLine.getId().toString()))
            .body(orderLine);
    }

    /**
     * {@code PATCH  /order-lines/:id} : Partial updates given fields of an existing orderLine, field will ignore if it is null
     *
     * @param id the id of the orderLine to save.
     * @param orderLine the orderLine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderLine,
     * or with status {@code 400 (Bad Request)} if the orderLine is not valid,
     * or with status {@code 404 (Not Found)} if the orderLine is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderLine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrderLine> partialUpdateOrderLine(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderLine orderLine
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update OrderLine partially : {}, {}", id, orderLine);
        if (orderLine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderLine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderLineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        boolean conflic = false;
        if (
            orderLine.getProduct() != null &&
            orderLine.getProduct().getQuantity() != null &&
            orderLine.getQuantity() != null &&
            orderLine.getProduct().getQuantity() < orderLine.getQuantity()
        ) {
            orderLine.setQuantity(orderLine.getProduct().getQuantity());
            conflic = true;
        }

        Optional<OrderLine> result = orderLineRepository
            .findById(orderLine.getId())
            .map(existingOrderLine -> {
                if (orderLine.getUnitPrice() != null) {
                    existingOrderLine.setUnitPrice(orderLine.getUnitPrice());
                }
                if (orderLine.getTotal() != null) {
                    existingOrderLine.setTotal(orderLine.getUnitPrice() * orderLine.getQuantity());
                }
                if (orderLine.getQuantity() != null) {
                    existingOrderLine.setQuantity(orderLine.getQuantity());
                }

                return existingOrderLine;
            })
            .map(orderLineRepository::save);

        if (conflic) return ResponseEntity.status(HttpStatus.SC_CONFLICT).body(orderLine);
        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderLine.getId().toString())
        );
    }

    /**
     * {@code GET  /order-lines} : get all the orderLines.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderLines in body.
     */
    @GetMapping("")
    public List<OrderLine> getAllOrderLines() {
        LOG.debug("REST request to get all OrderLines");
        return orderLineRepository.findAll();
    }

    /**
     * {@code GET  /order-lines/:id} : get the "id" orderLine.
     *
     * @param id the id of the orderLine to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderLine, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderLine> getOrderLine(@PathVariable("id") Long id) {
        LOG.debug("REST request to get OrderLine : {}", id);
        Optional<OrderLine> orderLine = orderLineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderLine);
    }

    /**
     * {@code DELETE  /order-lines/:id} : delete the "id" orderLine.
     *
     * @param id the id of the orderLine to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderLine(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete OrderLine : {}", id);
        orderLineRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
