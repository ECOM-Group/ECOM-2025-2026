package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.IllustratorTestSamples.*;
import static com.mycompany.myapp.domain.ProductTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class IllustratorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Illustrator.class);
        Illustrator illustrator1 = getIllustratorSample1();
        Illustrator illustrator2 = new Illustrator();
        assertThat(illustrator1).isNotEqualTo(illustrator2);

        illustrator2.setId(illustrator1.getId());
        assertThat(illustrator1).isEqualTo(illustrator2);

        illustrator2 = getIllustratorSample2();
        assertThat(illustrator1).isNotEqualTo(illustrator2);
    }

    @Test
    void cardsTest() {
        Illustrator illustrator = getIllustratorRandomSampleGenerator();
        Product productBack = getProductRandomSampleGenerator();

        illustrator.addCards(productBack);
        assertThat(illustrator.getCards()).containsOnly(productBack);
        assertThat(productBack.getIllustrator()).isEqualTo(illustrator);

        illustrator.removeCards(productBack);
        assertThat(illustrator.getCards()).doesNotContain(productBack);
        assertThat(productBack.getIllustrator()).isNull();

        illustrator.cards(new HashSet<>(Set.of(productBack)));
        assertThat(illustrator.getCards()).containsOnly(productBack);
        assertThat(productBack.getIllustrator()).isEqualTo(illustrator);

        illustrator.setCards(new HashSet<>());
        assertThat(illustrator.getCards()).doesNotContain(productBack);
        assertThat(productBack.getIllustrator()).isNull();
    }
}
