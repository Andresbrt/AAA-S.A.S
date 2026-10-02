package com.aaasas.inmobiliaria.shared.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Utility to generate URL-safe slugs from strings.
 */
public final class SlugUtil {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Pattern MULTIPLE_DASHES = Pattern.compile("-{2,}");

    private SlugUtil() {}

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }
        String noWhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(normalized).replaceAll("");
        slug = MULTIPLE_DASHES.matcher(slug).replaceAll("-");
        slug = slug.replaceAll("^-|-$", "");
        return slug.toLowerCase(Locale.ROOT);
    }
}
