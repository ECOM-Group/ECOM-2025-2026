package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Address;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Address entity.
 *
 * When extending this class, extend AddressRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface AddressRepository extends AddressRepositoryWithBagRelationships, JpaRepository<Address, Long> {
    default Optional<Address> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Address> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Address> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    @Query(
        value = "SELECT a.* FROM address a " + "JOIN rel_address__id ra ON a.id = ra.address_id " + "WHERE ra.id_id = :userId",
        nativeQuery = true
    )
    List<Address> findAllByUsersId(@Param("userId") Long userId);

    @Query(
        """
            SELECT a FROM Address a
            WHERE a.street = :street
            AND a.zipcode = :zipcode
            AND a.city = :city
        """
    )
    Optional<Address> findByStreetAndZipcodeAndCity(
        @Param("street") String street,
        @Param("zipcode") Integer zipcode,
        @Param("city") String city
    );

    @Query("SELECT a FROM Address a JOIN a.ids ids WHERE ids.id = :userId")
    List<Address> findAllByIdsContaining(@Param("userId") Long userId);
}
