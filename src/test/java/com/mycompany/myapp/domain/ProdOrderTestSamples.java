package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ProdOrderTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ProdOrder getProdOrderSample1() {
        return new ProdOrder().id(1L);
    }

    public static ProdOrder getProdOrderSample2() {
        return new ProdOrder().id(2L);
    }

    public static ProdOrder getProdOrderRandomSampleGenerator() {
        return new ProdOrder().id(longCount.incrementAndGet());
    }
}
