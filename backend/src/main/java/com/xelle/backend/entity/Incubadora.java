package com.xelle.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "incubadoras")
@Data
public class Incubadora {

    @Id
    @Column(name = "id_equipo")
    private String id; // Ej: "INC-01"

    // IMPORTANTE: Estos nombres deben coincidir con lo que espera el JS
    @Column(name = "temperatura_actual")
    private Double temperaturaActual;

    @Column(name = "co2_actual")
    private Double co2Actual;

    @Column(name = "humedad_actual")
    private Double humedadActual;

    @Column(name = "estado")
    private String estado; // "ok", "warning", "error"

    @Column(name = "ultima_lectura")
    private LocalDateTime ultimaLectura;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.ultimaLectura = LocalDateTime.now();
    }
}