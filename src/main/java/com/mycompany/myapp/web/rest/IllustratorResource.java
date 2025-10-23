package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Illustrator;
import com.mycompany.myapp.repository.IllustratorRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Illustrator}.
 */
@RestController
@RequestMapping("/api/illustrators")
@Transactional
public class IllustratorResource {

    private static final Logger LOG = LoggerFactory.getLogger(IllustratorResource.class);

    private static final String ENTITY_NAME = "illustrator";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IllustratorRepository illustratorRepository;

    public IllustratorResource(IllustratorRepository illustratorRepository) {
        this.illustratorRepository = illustratorRepository;
    }

    /**
     * {@code POST  /illustrators} : Create a new illustrator.
     *
     * @param illustrator the illustrator to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new illustrator, or with status {@code 400 (Bad Request)} if the illustrator has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Illustrator> createIllustrator(@RequestBody Illustrator illustrator) throws URISyntaxException {
        LOG.debug("REST request to save Illustrator : {}", illustrator);
        if (illustrator.getId() != null) {
            throw new BadRequestAlertException("A new illustrator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        illustrator = illustratorRepository.save(illustrator);
        return ResponseEntity.created(new URI("/api/illustrators/" + illustrator.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, illustrator.getId().toString()))
            .body(illustrator);
    }

    /**
     * {@code PUT  /illustrators/:id} : Updates an existing illustrator.
     *
     * @param id the id of the illustrator to save.
     * @param illustrator the illustrator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated illustrator,
     * or with status {@code 400 (Bad Request)} if the illustrator is not valid,
     * or with status {@code 500 (Internal Server Error)} if the illustrator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Illustrator> updateIllustrator(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Illustrator illustrator
    ) throws URISyntaxException {
        LOG.debug("REST request to update Illustrator : {}, {}", id, illustrator);
        if (illustrator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, illustrator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!illustratorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        illustrator = illustratorRepository.save(illustrator);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, illustrator.getId().toString()))
            .body(illustrator);
    }

    /**
     * {@code PATCH  /illustrators/:id} : Partial updates given fields of an existing illustrator, field will ignore if it is null
     *
     * @param id the id of the illustrator to save.
     * @param illustrator the illustrator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated illustrator,
     * or with status {@code 400 (Bad Request)} if the illustrator is not valid,
     * or with status {@code 404 (Not Found)} if the illustrator is not found,
     * or with status {@code 500 (Internal Server Error)} if the illustrator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Illustrator> partialUpdateIllustrator(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Illustrator illustrator
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Illustrator partially : {}, {}", id, illustrator);
        if (illustrator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, illustrator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!illustratorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Illustrator> result = illustratorRepository
            .findById(illustrator.getId())
            .map(existingIllustrator -> {
                if (illustrator.getFirstName() != null) {
                    existingIllustrator.setFirstName(illustrator.getFirstName());
                }
                if (illustrator.getLastName() != null) {
                    existingIllustrator.setLastName(illustrator.getLastName());
                }

                return existingIllustrator;
            })
            .map(illustratorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, illustrator.getId().toString())
        );
    }

    /**
     * {@code GET  /illustrators} : get all the illustrators.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of illustrators in body.
     */
    @GetMapping("")
    public List<Illustrator> getAllIllustrators() {
        LOG.debug("REST request to get all Illustrators");
        return illustratorRepository.findAll();
    }

    /**
     * {@code GET  /illustrators/:id} : get the "id" illustrator.
     *
     * @param id the id of the illustrator to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the illustrator, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Illustrator> getIllustrator(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Illustrator : {}", id);
        Optional<Illustrator> illustrator = illustratorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(illustrator);
    }

    /**
     * {@code DELETE  /illustrators/:id} : delete the "id" illustrator.
     *
     * @param id the id of the illustrator to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIllustrator(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Illustrator : {}", id);
        illustratorRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
