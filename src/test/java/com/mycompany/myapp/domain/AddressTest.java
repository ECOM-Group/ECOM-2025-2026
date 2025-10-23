package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AddressTestSamples.*;
import static com.mycompany.myapp.domain.ProdOrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AddressTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Address.class);
        Address address1 = getAddressSample1();
        Address address2 = new Address();
        assertThat(address1).isNotEqualTo(address2);

        address2.setId(address1.getId());
        assertThat(address1).isEqualTo(address2);

        address2 = getAddressSample2();
        assertThat(address1).isNotEqualTo(address2);
    }

    @Test
    void ordersTest() {
        Address address = getAddressRandomSampleGenerator();
        ProdOrder prodOrderBack = getProdOrderRandomSampleGenerator();

        address.addOrders(prodOrderBack);
        assertThat(address.getOrders()).containsOnly(prodOrderBack);
        assertThat(prodOrderBack.getAddress()).isEqualTo(address);

        address.removeOrders(prodOrderBack);
        assertThat(address.getOrders()).doesNotContain(prodOrderBack);
        assertThat(prodOrderBack.getAddress()).isNull();

        address.orders(new HashSet<>(Set.of(prodOrderBack)));
        assertThat(address.getOrders()).containsOnly(prodOrderBack);
        assertThat(prodOrderBack.getAddress()).isEqualTo(address);

        address.setOrders(new HashSet<>());
        assertThat(address.getOrders()).doesNotContain(prodOrderBack);
        assertThat(prodOrderBack.getAddress()).isNull();
    }
}
