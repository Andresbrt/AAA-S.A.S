package com.aaasas.inmobiliaria.project.infrastructure;

import com.aaasas.inmobiliaria.project.domain.Project;
import com.aaasas.inmobiliaria.project.domain.ProjectStatus;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * JPA Specifications for dynamic Project filtering. Avoids N+1 with fetch joins.
 */
public final class ProjectSpecifications {

    private ProjectSpecifications() {}

    public static Specification<Project> isNotDeleted() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }

    public static Specification<Project> isPublished() {
        return (root, query, cb) -> cb.isTrue(root.get("published"));
    }

    public static Specification<Project> hasStatus(ProjectStatus status) {
        return status == null ? null :
            (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Project> inCity(UUID cityId) {
        return cityId == null ? null :
            (root, query, cb) -> cb.equal(root.get("city").get("id"), cityId);
    }

    public static Specification<Project> isFeatured(Boolean featured) {
        return featured == null ? null :
            (root, query, cb) -> cb.equal(root.get("featured"), featured);
    }

    public static Specification<Project> priceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice != null && maxPrice != null) {
                return cb.and(
                    cb.greaterThanOrEqualTo(root.get("maxPrice"), minPrice),
                    cb.lessThanOrEqualTo(root.get("minPrice"), maxPrice)
                );
            } else if (minPrice != null) {
                return cb.greaterThanOrEqualTo(root.get("maxPrice"), minPrice);
            } else if (maxPrice != null) {
                return cb.lessThanOrEqualTo(root.get("minPrice"), maxPrice);
            }
            return null;
        };
    }

    public static Specification<Project> searchByName(String search) {
        return search == null || search.isBlank() ? null :
            (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%");
    }

    public static Specification<Project> fetchCity() {
        return (root, query, cb) -> {
            if (Long.class != query.getResultType() && long.class != query.getResultType()) {
                root.fetch("city", JoinType.LEFT).fetch("department", JoinType.LEFT);
            }
            return null;
        };
    }
}
