package com.xelle.backend.controller;

import com.xelle.backend.entity.Incubadora;
import com.xelle.backend.repository.IncubadoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/incubadoras")
@CrossOrigin(origins = "*") // Permite conexión desde Frontend
public class IncubadoraController {

    @Autowired
    private IncubadoraRepository repository;

    @GetMapping
    public List<Incubadora> getAll() {
        return repository.findAll();
    }
}