package com.xelle.backend.controller;

import com.xelle.backend.entity.Lote;
import com.xelle.backend.repository.LoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lotes")
@CrossOrigin(origins = "*") // Permite que tu Frontend HTML hable con Java
public class LoteController {

    @Autowired
    private LoteRepository loteRepository;

    // 1. Obtener todos los lotes (GET)
    @GetMapping
    public List<Lote> getAllLotes() {
        return loteRepository.findAll();
    }

    // 2. Guardar un nuevo lote (POST)
    @PostMapping
    public ResponseEntity<Lote> createLote(@RequestBody Lote lote) {
        Lote nuevoLote = loteRepository.save(lote);
        return ResponseEntity.ok(nuevoLote);
    }
}