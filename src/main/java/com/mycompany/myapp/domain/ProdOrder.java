package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProdOrder.
 */
@Entity
@Table(name = "prod_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProdOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "valid")
    private Boolean valid;

    @Column(name = "promo")
    private Float promo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "ids", "orders" }, allowSetters = true)
    private Address address;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "prodOrder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "prodOrder", "product" }, allowSetters = true)
    private Set<OrderLine> orderLines = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProdOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getValid() {
        return this.valid;
    }

    public ProdOrder valid(Boolean valid) {
        this.setValid(valid);
        return this;
    }

    public void setValid(Boolean valid) {
        this.valid = valid;
    }

    public Float getPromo() {
        return this.promo;
    }

    public ProdOrder promo(Float promo) {
        this.setPromo(promo);
        return this;
    }

    public void setPromo(Float promo) {
        this.promo = promo;
    }

    public Address getAddress() {
        return this.address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public ProdOrder address(Address address) {
        this.setAddress(address);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProdOrder user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<OrderLine> getOrderLines() {
        return this.orderLines;
    }

    public void setOrderLines(Set<OrderLine> orderLines) {
        if (this.orderLines != null) {
            this.orderLines.forEach(i -> i.setProdOrder(null));
        }
        if (orderLines != null) {
            orderLines.forEach(i -> i.setProdOrder(this));
        }
        this.orderLines = orderLines;
    }

    public ProdOrder orderLines(Set<OrderLine> orderLines) {
        this.setOrderLines(orderLines);
        return this;
    }

    public ProdOrder addOrderLines(OrderLine orderLine) {
        this.orderLines.add(orderLine);
        orderLine.setProdOrder(this);
        return this;
    }

    public ProdOrder removeOrderLines(OrderLine orderLine) {
        this.orderLines.remove(orderLine);
        orderLine.setProdOrder(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProdOrder)) {
            return false;
        }
        return getId() != null && getId().equals(((ProdOrder) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProdOrder{" +
            "id=" + getId() +
            ", valid='" + getValid() + "'" +
            ", promo=" + getPromo() +
            "}";
    }
}
