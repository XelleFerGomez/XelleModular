package com.xelle.backend.repository;

import com.xelle.backend.entity.Lote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoteRepository extends JpaRepository<Lote, Long> {
    // ¡Listo! Ya tienes métodos para guardar, buscar, borrar y actualizar.
}