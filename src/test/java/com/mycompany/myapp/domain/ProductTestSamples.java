package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ProductTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Product getProductSample1() {
        return new Product()
            .id(1L)
            .name("name1")
            .price(1)
            .desc("desc1")
            .quantity(1)
            .imageHash(1)
            .cardText("cardText1")
            .edition(1)
            .color("color1")
            .pageNum(1)
            .pageLoad(1)
            .capacity(1);
    }

    public static Product getProductSample2() {
        return new Product()
            .id(2L)
            .name("name2")
            .price(2)
            .desc("desc2")
            .quantity(2)
            .imageHash(2)
            .cardText("cardText2")
            .edition(2)
            .color("color2")
            .pageNum(2)
            .pageLoad(2)
            .capacity(2);
    }

    public static Product getProductRandomSampleGenerator() {
        return new Product()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .price(intCount.incrementAndGet())
            .desc(UUID.randomUUID().toString())
            .quantity(intCount.incrementAndGet())
            .imageHash(intCount.incrementAndGet())
            .cardText(UUID.randomUUID().toString())
            .edition(intCount.incrementAndGet())
            .color(UUID.randomUUID().toString())
            .pageNum(intCount.incrementAndGet())
            .pageLoad(intCount.incrementAndGet())
            .capacity(intCount.incrementAndGet());
    }
}
