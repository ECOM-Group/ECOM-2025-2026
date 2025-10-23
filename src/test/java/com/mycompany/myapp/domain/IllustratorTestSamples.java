package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class IllustratorTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Illustrator getIllustratorSample1() {
        return new Illustrator().id(1L).firstName("firstName1").lastName("lastName1");
    }

    public static Illustrator getIllustratorSample2() {
        return new Illustrator().id(2L).firstName("firstName2").lastName("lastName2");
    }

    public static Illustrator getIllustratorRandomSampleGenerator() {
        return new Illustrator()
            .id(longCount.incrementAndGet())
            .firstName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString());
    }
}
