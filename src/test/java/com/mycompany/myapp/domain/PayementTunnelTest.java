package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.PayementTunnelTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PayementTunnelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PayementTunnel.class);
        PayementTunnel payementTunnel1 = getPayementTunnelSample1();
        PayementTunnel payementTunnel2 = new PayementTunnel();
        assertThat(payementTunnel1).isNotEqualTo(payementTunnel2);

        payementTunnel2.setId(payementTunnel1.getId());
        assertThat(payementTunnel1).isEqualTo(payementTunnel2);

        payementTunnel2 = getPayementTunnelSample2();
        assertThat(payementTunnel1).isNotEqualTo(payementTunnel2);
    }
}
