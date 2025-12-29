package com.projetj2e.gateway.web;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cb")
public class ResilienceGatewayController {

    private static final Logger log =
            LoggerFactory.getLogger(ResilienceGatewayController.class);

    private final RestClient restClient;

    public ResilienceGatewayController(RestClient restClient) {
        this.restClient = restClient;
    }

    // ============== PRODUITS ==============

    @GetMapping("/produits")
    @CircuitBreaker(name = "produitsCB", fallbackMethod = "produitsFallback")
    public ResponseEntity<List<Map<String, Object>>> getProduitsViaGateway() {
        log.info("[CB] Appel /cb/produits vers microservice-produits");

        List<Map<String, Object>> produits =
                restClient.get()
                        .uri("http://microservice-produits/produits")
                        .retrieve()
                        .body(new ParameterizedTypeReference<>() {});

        return ResponseEntity.ok(produits);
    }

    public ResponseEntity<List<Map<String, Object>>> produitsFallback(Throwable ex) {
        log.warn("Fallback PRODUITS déclenché : {}", ex.toString());

        Map<String, Object> produitSecours = new HashMap<>();
        produitSecours.put("id", -1);
        produitSecours.put("nom", "Produit indisponible (fallback)");
        produitSecours.put("prix", 0);
        produitSecours.put("message",
                "Réponse fournie par la Gateway (Resilience4J)");

        return ResponseEntity.ok(List.of(produitSecours));
    }

    // ============== COMMANDES ==============

    @GetMapping("/commandes")
    @CircuitBreaker(name = "commandesCB", fallbackMethod = "commandesFallback")
    public ResponseEntity<List<Map<String, Object>>> getCommandesViaGateway() {
        log.info("[CB] Appel /cb/commandes vers microservice-commandes");

        List<Map<String, Object>> commandes =
                restClient.get()
                        .uri("http://microservice-commandes/commandes")
                        .retrieve()
                        .body(new ParameterizedTypeReference<>() {});

        return ResponseEntity.ok(commandes);
    }

    public ResponseEntity<List<Map<String, Object>>> commandesFallback(Throwable ex) {
        log.warn("Fallback COMMANDES déclenché : {}", ex.toString());

        Map<String, Object> commandeSecours = new HashMap<>();
        commandeSecours.put("id", -1);
        commandeSecours.put("description", "Commande indisponible (fallback)");
        commandeSecours.put("quantite", 0);
        commandeSecours.put("montant", 0);
        commandeSecours.put("message",
                "Réponse fournie par la Gateway (Resilience4J)");

        return ResponseEntity.ok(List.of(commandeSecours));
    }
}
