package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.repository.CustomerRepository;
import com.mycompany.myapp.service.dto.CustomerDTO;
import com.mycompany.myapp.service.mapper.CustomerMapper;
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

@RestController
@RequestMapping("/api/customers")
@Transactional
public class CustomerResource {

    private static final Logger LOG = LoggerFactory.getLogger(CustomerResource.class);
    private static final String ENTITY_NAME = "customer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerResource(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    @PostMapping("")
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody CustomerDTO dto) throws URISyntaxException {
        LOG.debug("REST request to save Customer : {}", dto);

        if (dto.getId() != null) {
            throw new BadRequestAlertException("A new customer cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Customer customer = customerMapper.toEntity(dto);
        customer = customerRepository.save(customer);

        CustomerDTO result = customerMapper.toDto(customer);

        return ResponseEntity.created(new URI("/api/customers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CustomerDTO dto
    ) throws URISyntaxException {
        LOG.debug("REST request to update Customer : {}, {}", id, dto);

        if (dto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!customerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Customer entity = customerMapper.toEntity(dto);
        entity = customerRepository.save(entity);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, entity.getId().toString()))
            .body(customerMapper.toDto(entity));
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CustomerDTO> partialUpdateCustomer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CustomerDTO dto
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Customer : {}, {}", id, dto);

        if (dto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!customerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CustomerDTO> result = customerRepository
            .findById(id)
            .map(existing -> {
                if (dto.getFirstName() != null) existing.setFirstName(dto.getFirstName());
                if (dto.getLastName() != null) existing.setLastName(dto.getLastName());
                if (dto.getUserId() != null) existing.setUser(customerMapper.fromId(dto.getUserId()));
                return existing;
            })
            .map(customerRepository::save)
            .map(customerMapper::toDto);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dto.getId().toString())
        );
    }

    @GetMapping("")
    public List<CustomerDTO> getAllCustomers() {
        LOG.debug("REST request to get all Customers");
        return customerRepository.findAll().stream().map(customerMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomer(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Customer : {}", id);
        Optional<CustomerDTO> result = customerRepository.findById(id).map(customerMapper::toDto);
        return ResponseUtil.wrapOrNotFound(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Customer : {}", id);
        customerRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
