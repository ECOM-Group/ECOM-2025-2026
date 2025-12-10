package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.repository.CustomerRepository;
import com.mycompany.myapp.service.dto.CustomerDTO;
import com.mycompany.myapp.service.mapper.CustomerMapper;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository repository;
    private final CustomerMapper mapper;

    public CustomerService(CustomerRepository repository, CustomerMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public CustomerDTO save(CustomerDTO dto) {
        Customer entity = mapper.toEntity(dto);
        entity = repository.save(entity);
        return mapper.toDto(entity);
    }

    @Transactional(readOnly = true)
    public List<CustomerDTO> findAll() {
        return repository.findAll().stream().map(mapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Optional<CustomerDTO> findOne(Long id) {
        return repository.findById(id).map(mapper::toDto);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
