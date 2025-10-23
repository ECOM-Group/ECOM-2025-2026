package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.IllustratorTestSamples.*;
import static com.mycompany.myapp.domain.OrderLineTestSamples.*;
import static com.mycompany.myapp.domain.ProductTestSamples.*;
import static com.mycompany.myapp.domain.ReviewTestSamples.*;
import static com.mycompany.myapp.domain.TagTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ProductTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Product.class);
        Product product1 = getProductSample1();
        Product product2 = new Product();
        assertThat(product1).isNotEqualTo(product2);

        product2.setId(product1.getId());
        assertThat(product1).isEqualTo(product2);

        product2 = getProductSample2();
        assertThat(product1).isNotEqualTo(product2);
    }

    @Test
    void illustratorTest() {
        Product product = getProductRandomSampleGenerator();
        Illustrator illustratorBack = getIllustratorRandomSampleGenerator();

        product.setIllustrator(illustratorBack);
        assertThat(product.getIllustrator()).isEqualTo(illustratorBack);

        product.illustrator(null);
        assertThat(product.getIllustrator()).isNull();
    }

    @Test
    void reviewsTest() {
        Product product = getProductRandomSampleGenerator();
        Review reviewBack = getReviewRandomSampleGenerator();

        product.addReviews(reviewBack);
        assertThat(product.getReviews()).containsOnly(reviewBack);
        assertThat(reviewBack.getProduct()).isEqualTo(product);

        product.removeReviews(reviewBack);
        assertThat(product.getReviews()).doesNotContain(reviewBack);
        assertThat(reviewBack.getProduct()).isNull();

        product.reviews(new HashSet<>(Set.of(reviewBack)));
        assertThat(product.getReviews()).containsOnly(reviewBack);
        assertThat(reviewBack.getProduct()).isEqualTo(product);

        product.setReviews(new HashSet<>());
        assertThat(product.getReviews()).doesNotContain(reviewBack);
        assertThat(reviewBack.getProduct()).isNull();
    }

    @Test
    void orderLinesTest() {
        Product product = getProductRandomSampleGenerator();
        OrderLine orderLineBack = getOrderLineRandomSampleGenerator();

        product.addOrderLines(orderLineBack);
        assertThat(product.getOrderLines()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getProduct()).isEqualTo(product);

        product.removeOrderLines(orderLineBack);
        assertThat(product.getOrderLines()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getProduct()).isNull();

        product.orderLines(new HashSet<>(Set.of(orderLineBack)));
        assertThat(product.getOrderLines()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getProduct()).isEqualTo(product);

        product.setOrderLines(new HashSet<>());
        assertThat(product.getOrderLines()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getProduct()).isNull();
    }

    @Test
    void tagsTest() {
        Product product = getProductRandomSampleGenerator();
        Tag tagBack = getTagRandomSampleGenerator();

        product.addTags(tagBack);
        assertThat(product.getTags()).containsOnly(tagBack);
        assertThat(tagBack.getIds()).containsOnly(product);

        product.removeTags(tagBack);
        assertThat(product.getTags()).doesNotContain(tagBack);
        assertThat(tagBack.getIds()).doesNotContain(product);

        product.tags(new HashSet<>(Set.of(tagBack)));
        assertThat(product.getTags()).containsOnly(tagBack);
        assertThat(tagBack.getIds()).containsOnly(product);

        product.setTags(new HashSet<>());
        assertThat(product.getTags()).doesNotContain(tagBack);
        assertThat(tagBack.getIds()).doesNotContain(product);
    }
}
