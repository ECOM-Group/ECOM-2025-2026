package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ProductImageTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ProductImage getProductImageSample1() {
        return new ProductImage().id(1L).url("url1");
    }

    public static ProductImage getProductImageSample2() {
        return new ProductImage().id(2L).url("url2");
    }

    public static ProductImage getProductImageRandomSampleGenerator() {
        return new ProductImage().id(longCount.incrementAndGet()).url(UUID.randomUUID().toString());
    }
}
