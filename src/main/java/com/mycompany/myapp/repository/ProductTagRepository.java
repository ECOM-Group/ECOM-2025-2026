package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Tag;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class ProductTagRepository {

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
        return em
            .createQuery("SELECT t FROM Tag t WHERE t.id IN " + "(SELECT r.tag_id FROM rel_tag__id r WHERE r.id_id = :pId)", Tag.class)
            .setParameter("pId", productId)
            .getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<Long> findProductIdsForTag(Long tagId) {
        return em.createNativeQuery("SELECT id_id FROM rel_tag__id WHERE tag_id = :tId").setParameter("tId", tagId).getResultList();
    }
}
