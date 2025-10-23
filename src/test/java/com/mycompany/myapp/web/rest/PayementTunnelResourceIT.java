package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.PayementTunnelAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.PayementTunnel;
import com.mycompany.myapp.domain.enumeration.PayementMode;
import com.mycompany.myapp.repository.PayementTunnelRepository;
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
 * Integration tests for the {@link PayementTunnelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PayementTunnelResourceIT {

    private static final PayementMode DEFAULT_PAYEMENT_METHOD = PayementMode.CREDIT_CARD;
    private static final PayementMode UPDATED_PAYEMENT_METHOD = PayementMode.SPIRITUAL_ESSENCE;

    private static final String ENTITY_API_URL = "/api/payement-tunnels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PayementTunnelRepository payementTunnelRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPayementTunnelMockMvc;

    private PayementTunnel payementTunnel;

    private PayementTunnel insertedPayementTunnel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PayementTunnel createEntity() {
        return new PayementTunnel().payementMethod(DEFAULT_PAYEMENT_METHOD);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PayementTunnel createUpdatedEntity() {
        return new PayementTunnel().payementMethod(UPDATED_PAYEMENT_METHOD);
    }

    @BeforeEach
    void initTest() {
        payementTunnel = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedPayementTunnel != null) {
            payementTunnelRepository.delete(insertedPayementTunnel);
            insertedPayementTunnel = null;
        }
    }

    @Test
    @Transactional
    void createPayementTunnel() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PayementTunnel
        var returnedPayementTunnel = om.readValue(
            restPayementTunnelMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(payementTunnel)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PayementTunnel.class
        );

        // Validate the PayementTunnel in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPayementTunnelUpdatableFieldsEquals(returnedPayementTunnel, getPersistedPayementTunnel(returnedPayementTunnel));

        insertedPayementTunnel = returnedPayementTunnel;
    }

    @Test
    @Transactional
    void createPayementTunnelWithExistingId() throws Exception {
        // Create the PayementTunnel with an existing ID
        payementTunnel.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPayementTunnelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(payementTunnel)))
            .andExpect(status().isBadRequest());

        // Validate the PayementTunnel in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPayementTunnels() throws Exception {
        // Initialize the database
        insertedPayementTunnel = payementTunnelRepository.saveAndFlush(payementTunnel);

        // Get all the payementTunnelList
        restPayementTunnelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(payementTunnel.getId().intValue())))
            .andExpect(jsonPath("$.[*].payementMethod").value(hasItem(DEFAULT_PAYEMENT_METHOD.toString())));
    }

    @Test
    @Transactional
    void getPayementTunnel() throws Exception {
        // Initialize the database
        insertedPayementTunnel = payementTunnelRepository.saveAndFlush(payementTunnel);

        // Get the payementTunnel
        restPayementTunnelMockMvc
            .perform(get(ENTITY_API_URL_ID, payementTunnel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(payementTunnel.getId().intValue()))
            .andExpect(jsonPath("$.payementMethod").value(DEFAULT_PAYEMENT_METHOD.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPayementTunnel() throws Exception {
        // Get the payementTunnel
        restPayementTunnelMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPayementTunnel() throws Exception {
        // Initialize the database
        insertedPayementTunnel = payementTunnelRepository.saveAndFlush(payementTunnel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the payementTunnel
        PayementTunnel updatedPayementTunnel = payementTunnelRepository.findById(payementTunnel.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPayementTunnel are not directly saved in db
        em.detach(updatedPayementTunnel);
        updatedPayementTunnel.payementMethod(UPDATED_PAYEMENT_METHOD);

        restPayementTunnelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPayementTunnel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPayementTunnel))
            )
            .andExpect(status().isOk());

        // Validate the PayementTunnel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPayementTunnelToMatchAllProperties(updatedPayementTunnel);
    }

    @Test
    @Transactional
    void putNonExistingPayementTunnel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payementTunnel.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPayementTunnelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, payementTunnel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(payementTunnel))
            )
            .andExpect(status().isBadRequest());

        // Validate the PayementTunnel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPayementTunnel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payementTunnel.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPayementTunnelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(payementTunnel))
            )
            .andExpect(status().isBadRequest());

        // Validate the PayementTunnel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPayementTunnel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payementTunnel.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPayementTunnelMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(payementTunnel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PayementTunnel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePayementTunnelWithPatch() throws Exception {
        // Initialize the database
        insertedPayementTunnel = payementTunnelRepository.saveAndFlush(payementTunnel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the payementTunnel using partial update
        PayementTunnel partialUpdatedPayementTunnel = new PayementTunnel();
        partialUpdatedPayementTunnel.setId(payementTunnel.getId());

        partialUpdatedPayementTunnel.payementMethod(UPDATED_PAYEMENT_METHOD);

        restPayementTunnelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPayementTunnel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPayementTunnel))
            )
            .andExpect(status().isOk());

        // Validate the PayementTunnel in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPayementTunnelUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPayementTunnel, payementTunnel),
            getPersistedPayementTunnel(payementTunnel)
        );
    }

    @Test
    @Transactional
    void fullUpdatePayementTunnelWithPatch() throws Exception {
        // Initialize the database
        insertedPayementTunnel = payementTunnelRepository.saveAndFlush(payementTunnel);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the payementTunnel using partial update
        PayementTunnel partialUpdatedPayementTunnel = new PayementTunnel();
        partialUpdatedPayementTunnel.setId(payementTunnel.getId());

        partialUpdatedPayementTunnel.payementMethod(UPDATED_PAYEMENT_METHOD);

        restPayementTunnelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPayementTunnel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPayementTunnel))
            )
            .andExpect(status().isOk());

        // Validate the PayementTunnel in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPayementTunnelUpdatableFieldsEquals(partialUpdatedPayementTunnel, getPersistedPayementTunnel(partialUpdatedPayementTunnel));
    }

    @Test
    @Transactional
    void patchNonExistingPayementTunnel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payementTunnel.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPayementTunnelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, payementTunnel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(payementTunnel))
            )
            .andExpect(status().isBadRequest());

        // Validate the PayementTunnel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPayementTunnel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payementTunnel.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPayementTunnelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(payementTunnel))
            )
            .andExpect(status().isBadRequest());

        // Validate the PayementTunnel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPayementTunnel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        payementTunnel.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPayementTunnelMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(payementTunnel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PayementTunnel in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePayementTunnel() throws Exception {
        // Initialize the database
        insertedPayementTunnel = payementTunnelRepository.saveAndFlush(payementTunnel);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the payementTunnel
        restPayementTunnelMockMvc
            .perform(delete(ENTITY_API_URL_ID, payementTunnel.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return payementTunnelRepository.count();
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

    protected PayementTunnel getPersistedPayementTunnel(PayementTunnel payementTunnel) {
        return payementTunnelRepository.findById(payementTunnel.getId()).orElseThrow();
    }

    protected void assertPersistedPayementTunnelToMatchAllProperties(PayementTunnel expectedPayementTunnel) {
        assertPayementTunnelAllPropertiesEquals(expectedPayementTunnel, getPersistedPayementTunnel(expectedPayementTunnel));
    }

    protected void assertPersistedPayementTunnelToMatchUpdatableProperties(PayementTunnel expectedPayementTunnel) {
        assertPayementTunnelAllUpdatablePropertiesEquals(expectedPayementTunnel, getPersistedPayementTunnel(expectedPayementTunnel));
    }
}
