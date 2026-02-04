package com.xelle.backend.repository;

import com.xelle.backend.entity.Cultivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CultivoRepository extends JpaRepository<Cultivo, Long> {
    // Buscar cultivos que no han sido descartados ni cosechados (Activos)
    List<Cultivo> findByEstadoNot(String estado);
}