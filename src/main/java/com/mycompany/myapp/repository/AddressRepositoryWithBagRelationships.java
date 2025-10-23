package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Address;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface AddressRepositoryWithBagRelationships {
    Optional<Address> fetchBagRelationships(Optional<Address> address);

    List<Address> fetchBagRelationships(List<Address> addresses);

    Page<Address> fetchBagRelationships(Page<Address> addresses);
}
