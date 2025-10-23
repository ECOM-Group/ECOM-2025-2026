package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.PayementMode;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PayementTunnel.
 */
@Entity
@Table(name = "payement_tunnel")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PayementTunnel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "payement_method")
    private PayementMode payementMethod;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PayementTunnel id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PayementMode getPayementMethod() {
        return this.payementMethod;
    }

    public PayementTunnel payementMethod(PayementMode payementMethod) {
        this.setPayementMethod(payementMethod);
        return this;
    }

    public void setPayementMethod(PayementMode payementMethod) {
        this.payementMethod = payementMethod;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PayementTunnel)) {
            return false;
        }
        return getId() != null && getId().equals(((PayementTunnel) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PayementTunnel{" +
            "id=" + getId() +
            ", payementMethod='" + getPayementMethod() + "'" +
            "}";
    }
}
