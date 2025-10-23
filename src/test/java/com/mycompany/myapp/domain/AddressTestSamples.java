package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AddressTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Address getAddressSample1() {
        return new Address().id(1L).country("country1").city("city1").street("street1").zipcode(1);
    }

    public static Address getAddressSample2() {
        return new Address().id(2L).country("country2").city("city2").street("street2").zipcode(2);
    }

    public static Address getAddressRandomSampleGenerator() {
        return new Address()
            .id(longCount.incrementAndGet())
            .country(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .street(UUID.randomUUID().toString())
            .zipcode(intCount.incrementAndGet());
    }
}
