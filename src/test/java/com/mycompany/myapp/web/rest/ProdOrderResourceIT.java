package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ProdOrderAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ProdOrder;
import com.mycompany.myapp.repository.ProdOrderRepository;
import com.mycompany.myapp.repository.UserRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProdOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProdOrderResourceIT {

    private static final Boolean DEFAULT_VALID = false;
    private static final Boolean UPDATED_VALID = true;

    private static final Float DEFAULT_PROMO = 1F;
    private static final Float UPDATED_PROMO = 2F;

    private static final String ENTITY_API_URL = "/api/prod-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProdOrderRepository prodOrderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProdOrderMockMvc;

    private ProdOrder prodOrder;

    private ProdOrder insertedProdOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProdOrder createEntity() {
        return new ProdOrder().valid(DEFAULT_VALID).promo(DEFAULT_PROMO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProdOrder createUpdatedEntity() {
        return new ProdOrder().valid(UPDATED_VALID).promo(UPDATED_PROMO);
    }

    @BeforeEach
    void initTest() {
        prodOrder = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedProdOrder != null) {
            prodOrderRepository.delete(insertedProdOrder);
            insertedProdOrder = null;
        }
    }

    @Test
    @Transactional
    void createProdOrder() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ProdOrder
        var returnedProdOrder = om.readValue(
            restProdOrderMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prodOrder)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProdOrder.class
        );

        // Validate the ProdOrder in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertProdOrderUpdatableFieldsEquals(returnedProdOrder, getPersistedProdOrder(returnedProdOrder));

        insertedProdOrder = returnedProdOrder;
    }

    @Test
    @Transactional
    void createProdOrderWithExistingId() throws Exception {
        // Create the ProdOrder with an existing ID
        prodOrder.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProdOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prodOrder)))
            .andExpect(status().isBadRequest());

        // Validate the ProdOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProdOrders() throws Exception {
        // Initialize the database
        insertedProdOrder = prodOrderRepository.saveAndFlush(prodOrder);

        // Get all the prodOrderList
        restProdOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(prodOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].valid").value(hasItem(DEFAULT_VALID)))
            .andExpect(jsonPath("$.[*].promo").value(hasItem(DEFAULT_PROMO.doubleValue())));
    }

    @Test
    @Transactional
    void getProdOrder() throws Exception {
        // Initialize the database
        insertedProdOrder = prodOrderRepository.saveAndFlush(prodOrder);

        // Get the prodOrder
        restProdOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, prodOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(prodOrder.getId().intValue()))
            .andExpect(jsonPath("$.valid").value(DEFAULT_VALID))
            .andExpect(jsonPath("$.promo").value(DEFAULT_PROMO.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingProdOrder() throws Exception {
        // Get the prodOrder
        restProdOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProdOrder() throws Exception {
        // Initialize the database
        insertedProdOrder = prodOrderRepository.saveAndFlush(prodOrder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the prodOrder
        ProdOrder updatedProdOrder = prodOrderRepository.findById(prodOrder.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProdOrder are not directly saved in db
        em.detach(updatedProdOrder);
        updatedProdOrder.valid(UPDATED_VALID).promo(UPDATED_PROMO);

        restProdOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProdOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedProdOrder))
            )
            .andExpect(status().isOk());

        // Validate the ProdOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProdOrderToMatchAllProperties(updatedProdOrder);
    }

    @Test
    @Transactional
    void putNonExistingProdOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prodOrder.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, prodOrder.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prodOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProdOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prodOrder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(prodOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProdOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prodOrder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdOrderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(prodOrder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProdOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProdOrderWithPatch() throws Exception {
        // Initialize the database
        insertedProdOrder = prodOrderRepository.saveAndFlush(prodOrder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the prodOrder using partial update
        ProdOrder partialUpdatedProdOrder = new ProdOrder();
        partialUpdatedProdOrder.setId(prodOrder.getId());

        partialUpdatedProdOrder.valid(UPDATED_VALID).promo(UPDATED_PROMO);

        restProdOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProdOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProdOrder))
            )
            .andExpect(status().isOk());

        // Validate the ProdOrder in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProdOrderUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProdOrder, prodOrder),
            getPersistedProdOrder(prodOrder)
        );
    }

    @Test
    @Transactional
    void fullUpdateProdOrderWithPatch() throws Exception {
        // Initialize the database
        insertedProdOrder = prodOrderRepository.saveAndFlush(prodOrder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the prodOrder using partial update
        ProdOrder partialUpdatedProdOrder = new ProdOrder();
        partialUpdatedProdOrder.setId(prodOrder.getId());

        partialUpdatedProdOrder.valid(UPDATED_VALID).promo(UPDATED_PROMO);

        restProdOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProdOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProdOrder))
            )
            .andExpect(status().isOk());

        // Validate the ProdOrder in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProdOrderUpdatableFieldsEquals(partialUpdatedProdOrder, getPersistedProdOrder(partialUpdatedProdOrder));
    }

    @Test
    @Transactional
    void patchNonExistingProdOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prodOrder.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, prodOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(prodOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProdOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prodOrder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(prodOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProdOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        prodOrder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdOrderMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(prodOrder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProdOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProdOrder() throws Exception {
        // Initialize the database
        insertedProdOrder = prodOrderRepository.saveAndFlush(prodOrder);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the prodOrder
        restProdOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, prodOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return prodOrderRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected ProdOrder getPersistedProdOrder(ProdOrder prodOrder) {
        return prodOrderRepository.findById(prodOrder.getId()).orElseThrow();
    }

    protected void assertPersistedProdOrderToMatchAllProperties(ProdOrder expectedProdOrder) {
        assertProdOrderAllPropertiesEquals(expectedProdOrder, getPersistedProdOrder(expectedProdOrder));
    }

    protected void assertPersistedProdOrderToMatchUpdatableProperties(ProdOrder expectedProdOrder) {
        assertProdOrderAllUpdatablePropertiesEquals(expectedProdOrder, getPersistedProdOrder(expectedProdOrder));
    }
}
