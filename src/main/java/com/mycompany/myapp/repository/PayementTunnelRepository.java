package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PayementTunnel;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PayementTunnel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PayementTunnelRepository extends JpaRepository<PayementTunnel, Long> {}
