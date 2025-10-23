package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Illustrator;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Illustrator entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IllustratorRepository extends JpaRepository<Illustrator, Long> {}
