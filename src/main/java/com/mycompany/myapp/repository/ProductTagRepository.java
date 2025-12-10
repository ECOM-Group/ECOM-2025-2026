package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Tag;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

@Repository
public class ProductTagRepository {

    private static final Logger LOG = LoggerFactory.getLogger(ProductTagRepository.class);

    @PersistenceContext
    private EntityManager em;

    public void addTagToProduct(Long productId, Long tagId) {
        em
            .createNativeQuery("INSERT INTO rel_tag__id (id_id, tag_id) VALUES (:pId, :tId)")
            .setParameter("pId", productId)
            .setParameter("tId", tagId)
            .executeUpdate();
    }

    public void removeTagFromProduct(Long productId, Long tagId) {
        em
            .createNativeQuery("DELETE FROM rel_tag__id WHERE id_id = :pId AND tag_id = :tId")
            .setParameter("pId", productId)
            .setParameter("tId", tagId)
            .executeUpdate();
    }

    public List<Tag> findTagsForProduct(Long productId) {
        try {
            @SuppressWarnings("unchecked")
            List<Tag> result = em
                .createNativeQuery("SELECT t.* FROM tag t " + "JOIN rel_tag__id r ON r.tag_id = t.id " + "WHERE r.id_id = :pId", Tag.class)
                .setParameter("pId", productId)
                .getResultList();

            return result;
        } catch (Exception e) {
            LOG.error("Error while retrieving tags for product id={}", productId, e);
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    public List<Long> findProductIdsForTag(Long tagId) {
        try {
            return em.createNativeQuery("SELECT id_id FROM rel_tag__id WHERE tag_id = :tId").setParameter("tId", tagId).getResultList();
        } catch (Exception e) {
            LOG.error("Error while products for tag_id id={}", tagId, e);
            throw e;
        }
    }
}
