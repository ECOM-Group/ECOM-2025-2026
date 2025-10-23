package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class PayementTunnelTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static PayementTunnel getPayementTunnelSample1() {
        return new PayementTunnel().id(1L);
    }

    public static PayementTunnel getPayementTunnelSample2() {
        return new PayementTunnel().id(2L);
    }

    public static PayementTunnel getPayementTunnelRandomSampleGenerator() {
        return new PayementTunnel().id(longCount.incrementAndGet());
    }
}
