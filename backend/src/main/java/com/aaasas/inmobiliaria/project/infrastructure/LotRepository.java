package com.aaasas.inmobiliaria.project.infrastructure;

import com.aaasas.inmobiliaria.project.domain.Lot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LotRepository extends JpaRepository<Lot, UUID> {
    
    List<Lot> findByProjectIdOrderByLotNumberAsc(UUID projectId);
    
    @Query("SELECT COUNT(l) FROM Lot l WHERE l.status = 'DISPONIBLE'")
    long countAvailableLots();
    
    @Query("SELECT COUNT(l) FROM Lot l WHERE l.status = 'VENDIDO'")
    long countSoldLots();
}