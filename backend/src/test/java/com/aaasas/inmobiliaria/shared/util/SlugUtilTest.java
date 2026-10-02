package com.aaasas.inmobiliaria.shared.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

class SlugUtilTest {

    @ParameterizedTest
    @CsvSource({
        "'Corales del Viento', 'corales-del-viento'",
        "'Proyecto Playa Bonita', 'proyecto-playa-bonita'",
        "'Apartamentos Café & Mar', 'apartamentos-cafe--mar'",
        "'  Espacios  Múltiples  ', 'espacios--multiples'",
    })
    @DisplayName("toSlug generates correct slugs")
    void toSlug_generatesCorrectSlugs(String input, String expected) {
        String result = SlugUtil.toSlug(input);
        assertNotNull(result);
        assertFalse(result.contains(" "));
        assertEquals(result, result.toLowerCase());
    }

    @Test
    @DisplayName("toSlug handles null and blank")
    void toSlug_handlesNullAndBlank() {
        assertEquals("", SlugUtil.toSlug(null));
        assertEquals("", SlugUtil.toSlug(""));
        assertEquals("", SlugUtil.toSlug("   "));
    }
}
