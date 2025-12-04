package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.CardType;
import com.mycompany.myapp.domain.enumeration.Language;
import com.mycompany.myapp.domain.enumeration.Material;
import com.mycompany.myapp.domain.enumeration.ProductType;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "prod_type")
    private ProductType prodType;

    @Column(name = "price")
    private Integer price;

    @Column(name = "jhi_desc")
    private String desc;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "image_hash")
    private Integer imageHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "card_type")
    private CardType cardType;

    @Column(name = "card_text")
    private String cardText;

    @Column(name = "edition")
    private Integer edition;

    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private Language language;

    @Enumerated(EnumType.STRING)
    @Column(name = "material")
    private Material material;

    @Column(name = "color")
    private String color;

    @Column(name = "page_num")
    private Integer pageNum;

    @Column(name = "page_load")
    private Integer pageLoad;

    @Column(name = "capacity")
    private Integer capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "cards" }, allowSetters = true)
    private Illustrator illustrator;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product" }, allowSetters = true)
    private Set<Review> reviews = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "prodOrder", "product" }, allowSetters = true)
    private Set<OrderLine> orderLines = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "ids")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ids" }, allowSetters = true)
    private Set<Tag> tags = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Product id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Product name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProductType getProdType() {
        return this.prodType;
    }

    public Product prodType(ProductType prodType) {
        this.setProdType(prodType);
        return this;
    }

    public void setProdType(ProductType prodType) {
        this.prodType = prodType;
    }

    public Integer getPrice() {
        return this.price;
    }

    public Product price(Integer price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getDesc() {
        return this.desc;
    }

    public Product desc(String desc) {
        this.setDesc(desc);
        return this;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public Product quantity(Integer quantity) {
        this.setQuantity(quantity);
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getImageHash() {
        return this.imageHash;
    }

    public Product imageHash(Integer imageHash) {
        this.setImageHash(imageHash);
        return this;
    }

    public void setImageHash(Integer imageHash) {
        this.imageHash = imageHash;
    }

    public CardType getCardType() {
        return this.cardType;
    }

    public Product cardType(CardType cardType) {
        this.setCardType(cardType);
        return this;
    }

    public void setCardType(CardType cardType) {
        this.cardType = cardType;
    }

    public String getCardText() {
        return this.cardText;
    }

    public Product cardText(String cardText) {
        this.setCardText(cardText);
        return this;
    }

    public void setCardText(String cardText) {
        this.cardText = cardText;
    }

    public Integer getEdition() {
        return this.edition;
    }

    public Product edition(Integer edition) {
        this.setEdition(edition);
        return this;
    }

    public void setEdition(Integer edition) {
        this.edition = edition;
    }

    public Language getLanguage() {
        return this.language;
    }

    public Product language(Language language) {
        this.setLanguage(language);
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Material getMaterial() {
        return this.material;
    }

    public Product material(Material material) {
        this.setMaterial(material);
        return this;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public String getColor() {
        return this.color;
    }

    public Product color(String color) {
        this.setColor(color);
        return this;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getPageNum() {
        return this.pageNum;
    }

    public Product pageNum(Integer pageNum) {
        this.setPageNum(pageNum);
        return this;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageLoad() {
        return this.pageLoad;
    }

    public Product pageLoad(Integer pageLoad) {
        this.setPageLoad(pageLoad);
        return this;
    }

    public void setPageLoad(Integer pageLoad) {
        this.pageLoad = pageLoad;
    }

    public Integer getCapacity() {
        return this.capacity;
    }

    public Product capacity(Integer capacity) {
        this.setCapacity(capacity);
        return this;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Illustrator getIllustrator() {
        return this.illustrator;
    }

    public void setIllustrator(Illustrator illustrator) {
        this.illustrator = illustrator;
    }

    public Product illustrator(Illustrator illustrator) {
        this.setIllustrator(illustrator);
        return this;
    }

    public Set<Review> getReviews() {
        return this.reviews;
    }

    public void setReviews(Set<Review> reviews) {
        if (this.reviews != null) {
            this.reviews.forEach(i -> i.setProduct(null));
        }
        if (reviews != null) {
            reviews.forEach(i -> i.setProduct(this));
        }
        this.reviews = reviews;
    }

    public Product reviews(Set<Review> reviews) {
        this.setReviews(reviews);
        return this;
    }

    public Product addReviews(Review review) {
        this.reviews.add(review);
        review.setProduct(this);
        return this;
    }

    public Product removeReviews(Review review) {
        this.reviews.remove(review);
        review.setProduct(null);
        return this;
    }

    public Set<OrderLine> getOrderLines() {
        return this.orderLines;
    }

    public void setOrderLines(Set<OrderLine> orderLines) {
        if (this.orderLines != null) {
            this.orderLines.forEach(i -> i.setProduct(null));
        }
        if (orderLines != null) {
            orderLines.forEach(i -> i.setProduct(this));
        }
        this.orderLines = orderLines;
    }

    public Product orderLines(Set<OrderLine> orderLines) {
        this.setOrderLines(orderLines);
        return this;
    }

    public Product addOrderLines(OrderLine orderLine) {
        this.orderLines.add(orderLine);
        orderLine.setProduct(this);
        return this;
    }

    public Product removeOrderLines(OrderLine orderLine) {
        this.orderLines.remove(orderLine);
        orderLine.setProduct(null);
        return this;
    }

    public Set<Tag> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tag> tags) {
        if (this.tags != null) {
            this.tags.forEach(i -> i.removeProduct(this));
        }
        if (tags != null) {
            tags.forEach(i -> i.addProduct(this));
        }
        this.tags = tags;
    }

    public Product tags(Set<Tag> tags) {
        this.setTags(tags);
        return this;
    }

    public Product addTags(Tag tag) {
        this.tags.add(tag);
        tag.getProducts().add(this);
        return this;
    }

    public Product removeTags(Tag tag) {
        this.tags.remove(tag);
        tag.getProducts().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return getId() != null && getId().equals(((Product) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", prodType='" + getProdType() + "'" +
            ", price=" + getPrice() +
            ", desc='" + getDesc() + "'" +
            ", quantity=" + getQuantity() +
            ", imageHash=" + getImageHash() +
            ", cardType='" + getCardType() + "'" +
            ", cardText='" + getCardText() + "'" +
            ", edition=" + getEdition() +
            ", language='" + getLanguage() + "'" +
            ", material='" + getMaterial() + "'" +
            ", color='" + getColor() + "'" +
            ", pageNum=" + getPageNum() +
            ", pageLoad=" + getPageLoad() +
            ", capacity=" + getCapacity() +
            "}";
    }
}
