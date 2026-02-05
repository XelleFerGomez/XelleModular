package com.xelle.backend.repository;

import com.xelle.backend.entity.Incubadora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncubadoraRepository extends JpaRepository<Incubadora, String> {
}