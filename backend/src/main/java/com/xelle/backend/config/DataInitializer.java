package com.xelle.backend.config;

import com.xelle.backend.entity.Incubadora;
import com.xelle.backend.repository.IncubadoraRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(IncubadoraRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                System.out.println("🌱 Creando incubadoras por defecto en Base de Datos...");
                
                crearInc(repository, "INC-01", 37.0, 5.0, 95.0, "ok");
                crearInc(repository, "INC-02", 37.2, 4.8, 94.0, "warning");
                crearInc(repository, "INC-03", 37.0, 5.0, 95.0, "ok");
                crearInc(repository, "INC-04", 0.0, 0.0, 0.0, "error");
            }
        };
    }

    private void crearInc(IncubadoraRepository repo, String id, Double t, Double co2, Double h, String status) {
        Incubadora i = new Incubadora();
        i.setId(id);
        i.setTemperaturaActual(t);
        i.setCo2Actual(co2);
        i.setHumedadActual(h);
        i.setEstado(status);
        repo.save(i);
    }
}