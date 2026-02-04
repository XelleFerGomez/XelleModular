package com.xelle.backend.controller;

import com.xelle.backend.entity.Cultivo;
import com.xelle.backend.repository.CultivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cultivos")
@CrossOrigin(origins = "*")
public class CultivoController {

    @Autowired
    private CultivoRepository cultivoRepository;

    // 1. Obtener todos los cultivos activos
    @GetMapping
    public List<Cultivo> getCultivosActivos() {
        // Retorna todo por ahora, luego filtraremos por estado
        return cultivoRepository.findAll();
    }

    // 2. Crear un nuevo cultivo (Inicio de P0 o Pase P1+)
    @PostMapping
    public ResponseEntity<Cultivo> createCultivo(@RequestBody Cultivo cultivo) {
        Cultivo nuevo = cultivoRepository.save(cultivo);
        return ResponseEntity.ok(nuevo);
    }

    // 3. Actualizar estado (Ej: Actualizar confluencia)
    @PutMapping("/{id}")
    public ResponseEntity<Cultivo> updateCultivo(@PathVariable Long id, @RequestBody Cultivo detalles) {
        return cultivoRepository.findById(id)
            .map(cultivo -> {
                cultivo.setConfluenciaActual(detalles.getConfluenciaActual());
                cultivo.setEstado(detalles.getEstado());
                cultivo.setFechaUltimaRevision(LocalDateTime.now());
                return ResponseEntity.ok(cultivoRepository.save(cultivo));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}