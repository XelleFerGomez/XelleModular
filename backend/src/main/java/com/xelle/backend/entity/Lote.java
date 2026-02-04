package com.xelle.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lotes")
@Data // Lombok: Crea Getters, Setters y toString automático
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Datos del Donante (FO-LC-17)
    @Column(name = "nombre_donante", nullable = false)
    private String nombreDonante;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "id_pasaporte", unique = true)
    private String idPasaporte;

    // Datos de la Muestra
    @Column(name = "tipo_tejido")
    private String tipoTejido;

    @Column(name = "fecha_colecta")
    private LocalDate fechaColecta;

    @Column(name = "temperatura_recepcion")
    private Double temperaturaRecepcion;

    // Metadatos del Sistema
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
    }
}