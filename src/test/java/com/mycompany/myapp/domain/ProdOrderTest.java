package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AddressTestSamples.*;
import static com.mycompany.myapp.domain.OrderLineTestSamples.*;
import static com.mycompany.myapp.domain.ProdOrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ProdOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProdOrder.class);
        ProdOrder prodOrder1 = getProdOrderSample1();
        ProdOrder prodOrder2 = new ProdOrder();
        assertThat(prodOrder1).isNotEqualTo(prodOrder2);

        prodOrder2.setId(prodOrder1.getId());
        assertThat(prodOrder1).isEqualTo(prodOrder2);

        prodOrder2 = getProdOrderSample2();
        assertThat(prodOrder1).isNotEqualTo(prodOrder2);
    }

    @Test
    void addressTest() {
        ProdOrder prodOrder = getProdOrderRandomSampleGenerator();
        Address addressBack = getAddressRandomSampleGenerator();

        prodOrder.setAddress(addressBack);
        assertThat(prodOrder.getAddress()).isEqualTo(addressBack);

        prodOrder.address(null);
        assertThat(prodOrder.getAddress()).isNull();
    }

    @Test
    void orderLinesTest() {
        ProdOrder prodOrder = getProdOrderRandomSampleGenerator();
        OrderLine orderLineBack = getOrderLineRandomSampleGenerator();

        prodOrder.addOrderLines(orderLineBack);
        assertThat(prodOrder.getOrderLines()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getProdOrder()).isEqualTo(prodOrder);

        prodOrder.removeOrderLines(orderLineBack);
        assertThat(prodOrder.getOrderLines()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getProdOrder()).isNull();

        prodOrder.orderLines(new HashSet<>(Set.of(orderLineBack)));
        assertThat(prodOrder.getOrderLines()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getProdOrder()).isEqualTo(prodOrder);

        prodOrder.setOrderLines(new HashSet<>());
        assertThat(prodOrder.getOrderLines()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getProdOrder()).isNull();
    }
}
