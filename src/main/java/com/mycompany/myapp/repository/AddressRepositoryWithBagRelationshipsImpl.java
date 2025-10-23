package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Address;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class AddressRepositoryWithBagRelationshipsImpl implements AddressRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String ADDRESSES_PARAMETER = "addresses";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Address> fetchBagRelationships(Optional<Address> address) {
        return address.map(this::fetchIds);
    }

    @Override
    public Page<Address> fetchBagRelationships(Page<Address> addresses) {
        return new PageImpl<>(fetchBagRelationships(addresses.getContent()), addresses.getPageable(), addresses.getTotalElements());
    }

    @Override
    public List<Address> fetchBagRelationships(List<Address> addresses) {
        return Optional.of(addresses).map(this::fetchIds).orElse(Collections.emptyList());
    }

    Address fetchIds(Address result) {
        return entityManager
            .createQuery("select address from Address address left join fetch address.ids where address.id = :id", Address.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Address> fetchIds(List<Address> addresses) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, addresses.size()).forEach(index -> order.put(addresses.get(index).getId(), index));
        List<Address> result = entityManager
            .createQuery("select address from Address address left join fetch address.ids where address in :addresses", Address.class)
            .setParameter(ADDRESSES_PARAMETER, addresses)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
