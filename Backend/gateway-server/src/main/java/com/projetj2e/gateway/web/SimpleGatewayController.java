package com.projetj2e.gateway.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class SimpleGatewayController {

    private static final Logger log = LoggerFactory.getLogger(SimpleGatewayController.class);

    private final RestClient restClient;

    public SimpleGatewayController(RestClient restClient) {
        this.restClient = restClient;
    }

    // ======= Gateway simple vers microservice-produits =======
    @GetMapping("/produits")
    public ResponseEntity<List<Map<String, Object>>> getProduits() {
        log.info("➡️ [SIMPLE] Appel /produits via microservice-produits");
        List<Map<String, Object>> produits =
                restClient.get()
                        .uri("http://microservice-produits/produits")
                        .retrieve()
                        .body(new ParameterizedTypeReference<>() {});
        return ResponseEntity.ok(produits);
    }

    // ======= Gateway simple vers microservice-commandes =======
    @GetMapping("/commandes")
    public ResponseEntity<List<Map<String, Object>>> getCommandes() {
        log.info("➡️ [SIMPLE] Appel /commandes via microservice-commandes");
        List<Map<String, Object>> commandes =
                restClient.get()
                        .uri("http://microservice-commandes/commandes")
                        .retrieve()
                        .body(new ParameterizedTypeReference<>() {});
        return ResponseEntity.ok(commandes);
    }
}
