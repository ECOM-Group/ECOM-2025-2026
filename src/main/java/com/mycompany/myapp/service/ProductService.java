import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final EntityManager entityManager;
    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository, EntityManager entityManager) {
        this.productRepository = productRepository;
        this.entityManager = entityManager;
    }

    @Override
    public List<Product> findByKeywords(List<String> keywords) {
        if (keywords == null || keywords.isEmpty()) {
            return productRepository.findAll(); //pas sur que ce soit top
        }

        String base = "SELECT p FROM Product p WHERE ";
        String where = keywords.stream()
            .map(k -> "(LOWER(p.name) LIKE :k_" + k.hashCode() + " OR LOWER(p.desc) LIKE :k_" + k.hashCode() + ")")
            .collect(Collectors.joining(" AND "));

        Query query = entityManager.createQuery(base + where, Product.class);

        for (String k : keywords) {
            query.setParameter("k_" + k.hashCode(), "%" + k.toLowerCase() + "%");
        }

        return query.getResultList();
    }
}
