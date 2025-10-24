package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.OrderLine;
import com.mycompany.myapp.domain.PayementTunnel;
import com.mycompany.myapp.domain.ProdOrder;
import com.mycompany.myapp.repository.OrderLineRepository;
import com.mycompany.myapp.repository.PayementTunnelRepository;
import com.mycompany.myapp.repository.ProdOrderRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
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
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.PayementTunnel}.
 */
@RestController
@RequestMapping("/api/payement-tunnels")
@Transactional
public class PayementTunnelResource {

    private static final Logger LOG = LoggerFactory.getLogger(PayementTunnelResource.class);

    private static final String ENTITY_NAME = "payementTunnel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    private final PayementTunnelRepository payementTunnelRepository;
    private final ProdOrderRepository prodOrderRepository;
    private final OrderLineRepository orderLineRepository;

    public PayementTunnelResource(
        PayementTunnelRepository payementTunnelRepository,
        ProdOrderRepository prodOrderRepository,
        OrderLineRepository orderLineRepository
    ) {
        this.payementTunnelRepository = payementTunnelRepository;
        this.prodOrderRepository = prodOrderRepository;
        this.orderLineRepository = orderLineRepository;
    }

    /**
     * Stripe checkout session creation based on user's current (unpaid) order.
     */
    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@PathVariable Long userId) throws Exception {
        LOG.debug("REST request to create Stripe checkout session for user {}", userId);
        Stripe.apiKey = stripeSecretKey;

        // Recup le pannier courrant
        ProdOrder order = prodOrderRepository.findInvalidByUserIsCurrentUser();
        if (order == null) {
            LOG.warn("Aucun panier actif trouvé pour l’utilisateur {}", userId);
            return ResponseEntity.badRequest().body(Map.of("error", "Aucun panier actif trouvé pour cet utilisateur."));
        }

        // Récupérer les order lines du panier
        List<OrderLine> orderLines = orderLineRepository.findByOrderId(order.getId());
        if (orderLines.isEmpty()) {
            LOG.warn("Le panier {} de l’utilisateur {} est vide", order.getId(), userId);
            return ResponseEntity.badRequest().body(Map.of("error", "Le panier est vide."));
        }

        // Créer la session stripe
        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl("http://localhost:4200/success")
            .setCancelUrl("http://localhost:4200/cancel");

        for (OrderLine line : orderLines) {
            double unitPrice = line.getUnitPrice() != null ? line.getUnitPrice() : 0.0;
            int quantity = line.getQuantity() != null ? line.getQuantity() : 1;

            String productName = line.getProduct() != null ? line.getProduct().getName() : "Unknown";
            paramsBuilder.addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity((long) quantity)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("eur")
                            .setUnitAmount(Math.round(unitPrice * 100))
                            .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder().setName(productName).build())
                            .build()
                    )
                    .build()
            );
        }

        Session session = Session.create(paramsBuilder.build());
        LOG.debug("Session Stripe créée avec succès pour l’utilisateur {} : {}", userId, session.getId());

        return ResponseEntity.ok(Map.of("url", session.getUrl()));
    }

    /**
     * {@code POST  /payement-tunnels} : Create a new payementTunnel.
     *
     * @param payementTunnel the payementTunnel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new payementTunnel, or with status {@code 400 (Bad Request)} if the payementTunnel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PayementTunnel> createPayementTunnel(@RequestBody PayementTunnel payementTunnel) throws URISyntaxException {
        LOG.debug("REST request to save PayementTunnel : {}", payementTunnel);
        if (payementTunnel.getId() != null) {
            throw new BadRequestAlertException("A new payementTunnel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        payementTunnel = payementTunnelRepository.save(payementTunnel);
        return ResponseEntity.created(new URI("/api/payement-tunnels/" + payementTunnel.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, payementTunnel.getId().toString()))
            .body(payementTunnel);
    }

    /**
     * {@code PUT  /payement-tunnels/:id} : Updates an existing payementTunnel.
     *
     * @param id the id of the payementTunnel to save.
     * @param payementTunnel the payementTunnel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated payementTunnel,
     * or with status {@code 400 (Bad Request)} if the payementTunnel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the payementTunnel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PayementTunnel> updatePayementTunnel(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PayementTunnel payementTunnel
    ) throws URISyntaxException {
        LOG.debug("REST request to update PayementTunnel : {}, {}", id, payementTunnel);
        if (payementTunnel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, payementTunnel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!payementTunnelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        payementTunnel = payementTunnelRepository.save(payementTunnel);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, payementTunnel.getId().toString()))
            .body(payementTunnel);
    }

    /**
     * {@code PATCH  /payement-tunnels/:id} : Partial updates given fields of an existing payementTunnel, field will ignore if it is null
     *
     * @param id the id of the payementTunnel to save.
     * @param payementTunnel the payementTunnel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated payementTunnel,
     * or with status {@code 400 (Bad Request)} if the payementTunnel is not valid,
     * or with status {@code 404 (Not Found)} if the payementTunnel is not found,
     * or with status {@code 500 (Internal Server Error)} if the payementTunnel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PayementTunnel> partialUpdatePayementTunnel(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PayementTunnel payementTunnel
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update PayementTunnel partially : {}, {}", id, payementTunnel);
        if (payementTunnel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, payementTunnel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!payementTunnelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PayementTunnel> result = payementTunnelRepository
            .findById(payementTunnel.getId())
            .map(existingPayementTunnel -> {
                if (payementTunnel.getPayementMethod() != null) {
                    existingPayementTunnel.setPayementMethod(payementTunnel.getPayementMethod());
                }

                return existingPayementTunnel;
            })
            .map(payementTunnelRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, payementTunnel.getId().toString())
        );
    }

    /**
     * {@code GET  /payement-tunnels} : get all the payementTunnels.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of payementTunnels in body.
     */
    @GetMapping("")
    public List<PayementTunnel> getAllPayementTunnels() {
        LOG.debug("REST request to get all PayementTunnels");
        return payementTunnelRepository.findAll();
    }

    /**
     * {@code GET  /payement-tunnels/:id} : get the "id" payementTunnel.
     *
     * @param id the id of the payementTunnel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the payementTunnel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PayementTunnel> getPayementTunnel(@PathVariable("id") Long id) {
        LOG.debug("REST request to get PayementTunnel : {}", id);
        Optional<PayementTunnel> payementTunnel = payementTunnelRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(payementTunnel);
    }

    /**
     * {@code DELETE  /payement-tunnels/:id} : delete the "id" payementTunnel.
     *
     * @param id the id of the payementTunnel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayementTunnel(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete PayementTunnel : {}", id);
        payementTunnelRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
