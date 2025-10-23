package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.IllustratorAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Illustrator;
import com.mycompany.myapp.repository.IllustratorRepository;
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
 * Integration tests for the {@link IllustratorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IllustratorResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/illustrators";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private IllustratorRepository illustratorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIllustratorMockMvc;

    private Illustrator illustrator;

    private Illustrator insertedIllustrator;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Illustrator createEntity() {
        return new Illustrator().firstName(DEFAULT_FIRST_NAME).lastName(DEFAULT_LAST_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Illustrator createUpdatedEntity() {
        return new Illustrator().firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);
    }

    @BeforeEach
    void initTest() {
        illustrator = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedIllustrator != null) {
            illustratorRepository.delete(insertedIllustrator);
            insertedIllustrator = null;
        }
    }

    @Test
    @Transactional
    void createIllustrator() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Illustrator
        var returnedIllustrator = om.readValue(
            restIllustratorMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(illustrator)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Illustrator.class
        );

        // Validate the Illustrator in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertIllustratorUpdatableFieldsEquals(returnedIllustrator, getPersistedIllustrator(returnedIllustrator));

        insertedIllustrator = returnedIllustrator;
    }

    @Test
    @Transactional
    void createIllustratorWithExistingId() throws Exception {
        // Create the Illustrator with an existing ID
        illustrator.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIllustratorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(illustrator)))
            .andExpect(status().isBadRequest());

        // Validate the Illustrator in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllIllustrators() throws Exception {
        // Initialize the database
        insertedIllustrator = illustratorRepository.saveAndFlush(illustrator);

        // Get all the illustratorList
        restIllustratorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(illustrator.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)));
    }

    @Test
    @Transactional
    void getIllustrator() throws Exception {
        // Initialize the database
        insertedIllustrator = illustratorRepository.saveAndFlush(illustrator);

        // Get the illustrator
        restIllustratorMockMvc
            .perform(get(ENTITY_API_URL_ID, illustrator.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(illustrator.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME));
    }

    @Test
    @Transactional
    void getNonExistingIllustrator() throws Exception {
        // Get the illustrator
        restIllustratorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingIllustrator() throws Exception {
        // Initialize the database
        insertedIllustrator = illustratorRepository.saveAndFlush(illustrator);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the illustrator
        Illustrator updatedIllustrator = illustratorRepository.findById(illustrator.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedIllustrator are not directly saved in db
        em.detach(updatedIllustrator);
        updatedIllustrator.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restIllustratorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIllustrator.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedIllustrator))
            )
            .andExpect(status().isOk());

        // Validate the Illustrator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedIllustratorToMatchAllProperties(updatedIllustrator);
    }

    @Test
    @Transactional
    void putNonExistingIllustrator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        illustrator.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIllustratorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, illustrator.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(illustrator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Illustrator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIllustrator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        illustrator.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIllustratorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(illustrator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Illustrator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIllustrator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        illustrator.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIllustratorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(illustrator)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Illustrator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIllustratorWithPatch() throws Exception {
        // Initialize the database
        insertedIllustrator = illustratorRepository.saveAndFlush(illustrator);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the illustrator using partial update
        Illustrator partialUpdatedIllustrator = new Illustrator();
        partialUpdatedIllustrator.setId(illustrator.getId());

        partialUpdatedIllustrator.firstName(UPDATED_FIRST_NAME);

        restIllustratorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIllustrator.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedIllustrator))
            )
            .andExpect(status().isOk());

        // Validate the Illustrator in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertIllustratorUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedIllustrator, illustrator),
            getPersistedIllustrator(illustrator)
        );
    }

    @Test
    @Transactional
    void fullUpdateIllustratorWithPatch() throws Exception {
        // Initialize the database
        insertedIllustrator = illustratorRepository.saveAndFlush(illustrator);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the illustrator using partial update
        Illustrator partialUpdatedIllustrator = new Illustrator();
        partialUpdatedIllustrator.setId(illustrator.getId());

        partialUpdatedIllustrator.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restIllustratorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIllustrator.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedIllustrator))
            )
            .andExpect(status().isOk());

        // Validate the Illustrator in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertIllustratorUpdatableFieldsEquals(partialUpdatedIllustrator, getPersistedIllustrator(partialUpdatedIllustrator));
    }

    @Test
    @Transactional
    void patchNonExistingIllustrator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        illustrator.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIllustratorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, illustrator.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(illustrator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Illustrator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIllustrator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        illustrator.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIllustratorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(illustrator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Illustrator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIllustrator() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        illustrator.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIllustratorMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(illustrator)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Illustrator in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIllustrator() throws Exception {
        // Initialize the database
        insertedIllustrator = illustratorRepository.saveAndFlush(illustrator);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the illustrator
        restIllustratorMockMvc
            .perform(delete(ENTITY_API_URL_ID, illustrator.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return illustratorRepository.count();
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

    protected Illustrator getPersistedIllustrator(Illustrator illustrator) {
        return illustratorRepository.findById(illustrator.getId()).orElseThrow();
    }

    protected void assertPersistedIllustratorToMatchAllProperties(Illustrator expectedIllustrator) {
        assertIllustratorAllPropertiesEquals(expectedIllustrator, getPersistedIllustrator(expectedIllustrator));
    }

    protected void assertPersistedIllustratorToMatchUpdatableProperties(Illustrator expectedIllustrator) {
        assertIllustratorAllUpdatablePropertiesEquals(expectedIllustrator, getPersistedIllustrator(expectedIllustrator));
    }
}
