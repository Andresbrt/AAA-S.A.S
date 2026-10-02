package com.aaasas.inmobiliaria.location.application;

import com.aaasas.inmobiliaria.location.api.CityResponse;
import com.aaasas.inmobiliaria.location.api.DepartmentResponse;
import com.aaasas.inmobiliaria.location.infrastructure.CityRepository;
import com.aaasas.inmobiliaria.location.infrastructure.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final CityRepository cityRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    @Cacheable("departments")
    public List<DepartmentResponse> findAllDepartments() {
        return departmentRepository.findAll().stream()
            .map(d -> new DepartmentResponse(d.getId(), d.getName()))
            .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "cities", key = "#departmentId != null ? #departmentId : 'all'")
    public List<CityResponse> findCities(UUID departmentId) {
        var cities = departmentId != null
            ? cityRepository.findAllByDepartmentId(departmentId)
            : cityRepository.findAll();

        return cities.stream()
            .map(c -> new CityResponse(c.getId(), c.getName(), c.getDepartment().getName()))
            .toList();
    }
}
