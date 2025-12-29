package com.projetj2e.microservice_commandes.health;

import com.projetj2e.microservice_commandes.repository.CommandeRepository;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class CommandesHealthIndicator implements HealthIndicator {

    private final CommandeRepository commandeRepository;

    public CommandesHealthIndicator(CommandeRepository commandeRepository) {
        this.commandeRepository = commandeRepository;
    }

    @Override
    public Health health() {
        long count = commandeRepository.count();

        if (count > 0) {
            // Table non vide → UP
            return Health.up()
                    .withDetail("message", "Table commande non vide")
                    .withDetail("nombre_commandes", count)
                    .build();
        } else {
            // Table vide → DOWN
            return Health.down()
                    .withDetail("message", "Table commande vide")
                    .withDetail("nombre_commandes", count)
                    .build();
        }
    }
}
