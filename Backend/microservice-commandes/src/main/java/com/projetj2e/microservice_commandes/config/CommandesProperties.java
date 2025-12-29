package com.projetj2e.microservice_commandes.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

@Component
@RefreshScope
@ConfigurationProperties(prefix = "mes-config-ms")
@Data
public class CommandesProperties {

    /**
     * Correspond à la propriété :
     * mes-config-ms.commandes-last=10
     * définie dans microservice-commandes.properties (GitHub)
     */
    private int commandesLast;
}
