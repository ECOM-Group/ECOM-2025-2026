package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Address.
 */
@Entity
@Table(name = "address")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Address implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "street")
    private String street;

    @Column(name = "zipcode")
    private Integer zipcode;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "rel_address__id", joinColumns = @JoinColumn(name = "address_id"), inverseJoinColumns = @JoinColumn(name = "id_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> ids = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "address")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "address", "user", "orderLines" }, allowSetters = true)
    private Set<ProdOrder> orders = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Address id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCountry() {
        return this.country;
    }

    public Address country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return this.city;
    }

    public Address city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return this.street;
    }

    public Address street(String street) {
        this.setStreet(street);
        return this;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public Integer getZipcode() {
        return this.zipcode;
    }

    public Address zipcode(Integer zipcode) {
        this.setZipcode(zipcode);
        return this;
    }

    public void setZipcode(Integer zipcode) {
        this.zipcode = zipcode;
    }

    public Set<User> getIds() {
        return this.ids;
    }

    public void setIds(Set<User> users) {
        this.ids = users;
    }

    public Address ids(Set<User> users) {
        this.setIds(users);
        return this;
    }

    public Address addId(User user) {
        this.ids.add(user);
        return this;
    }

    public Address removeId(User user) {
        this.ids.remove(user);
        return this;
    }

    public Set<ProdOrder> getOrders() {
        return this.orders;
    }

    public void setOrders(Set<ProdOrder> prodOrders) {
        if (this.orders != null) {
            this.orders.forEach(i -> i.setAddress(null));
        }
        if (prodOrders != null) {
            prodOrders.forEach(i -> i.setAddress(this));
        }
        this.orders = prodOrders;
    }

    public Address orders(Set<ProdOrder> prodOrders) {
        this.setOrders(prodOrders);
        return this;
    }

    public Address addOrders(ProdOrder prodOrder) {
        this.orders.add(prodOrder);
        prodOrder.setAddress(this);
        return this;
    }

    public Address removeOrders(ProdOrder prodOrder) {
        this.orders.remove(prodOrder);
        prodOrder.setAddress(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Address)) {
            return false;
        }
        return getId() != null && getId().equals(((Address) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Address{" +
            "id=" + getId() +
            ", country='" + getCountry() + "'" +
            ", city='" + getCity() + "'" +
            ", street='" + getStreet() + "'" +
            ", zipcode=" + getZipcode() +
            "}";
    }
}
