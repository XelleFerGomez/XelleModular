package com.xelle.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "cultivos")
@Data
public class Cultivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Un Cultivo viene de un Lote original (por su ID o Nombre)
    @Column(name = "lote_origen_id")
    private String loteOrigenId; 

    @Column(name = "linea_celular")
    private String lineaCelular; // Ej: MSC-Wharton

    @Column(name = "pasaje_actual")
    private Integer pasajeActual; // Ej: 3 (para P3)

    @Column(name = "incubadora_ubicacion")
    private String incubadoraUbicacion; // Ej: INC-01

    @Column(name = "confluencia_actual")
    private Integer confluenciaActual; // 0 a 100%

    // Estado: "En Proceso", "Listo para Pase", "Cosechado", "Descartado"
    @Column(name = "estado")
    private String estado;

    @Column(name = "fecha_inicio_fase")
    private LocalDateTime fechaInicioFase;

    @Column(name = "fecha_ultima_revision")
    private LocalDateTime fechaUltimaRevision;

    @PrePersist
    protected void onCreate() {
        this.fechaInicioFase = LocalDateTime.now();
        this.fechaUltimaRevision = LocalDateTime.now();
        if(this.estado == null) this.estado = "En Proceso";
    }
}