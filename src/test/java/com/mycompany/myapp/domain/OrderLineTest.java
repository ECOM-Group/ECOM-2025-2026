package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.OrderLineTestSamples.*;
import static com.mycompany.myapp.domain.ProdOrderTestSamples.*;
import static com.mycompany.myapp.domain.ProductTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderLineTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderLine.class);
        OrderLine orderLine1 = getOrderLineSample1();
        OrderLine orderLine2 = new OrderLine();
        assertThat(orderLine1).isNotEqualTo(orderLine2);

        orderLine2.setId(orderLine1.getId());
        assertThat(orderLine1).isEqualTo(orderLine2);

        orderLine2 = getOrderLineSample2();
        assertThat(orderLine1).isNotEqualTo(orderLine2);
    }

    @Test
    void prodOrderTest() {
        OrderLine orderLine = getOrderLineRandomSampleGenerator();
        ProdOrder prodOrderBack = getProdOrderRandomSampleGenerator();

        orderLine.setProdOrder(prodOrderBack);
        assertThat(orderLine.getProdOrder()).isEqualTo(prodOrderBack);

        orderLine.prodOrder(null);
        assertThat(orderLine.getProdOrder()).isNull();
    }

    @Test
    void productTest() {
        OrderLine orderLine = getOrderLineRandomSampleGenerator();
        Product productBack = getProductRandomSampleGenerator();

        orderLine.setProduct(productBack);
        assertThat(orderLine.getProduct()).isEqualTo(productBack);

        orderLine.product(null);
        assertThat(orderLine.getProduct()).isNull();
    }
}
