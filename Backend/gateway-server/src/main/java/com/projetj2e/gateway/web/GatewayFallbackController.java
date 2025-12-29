package com.projetj2e.gateway.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class GatewayFallbackController {

    @GetMapping("/fallback/produits")
    public ResponseEntity<List<Map<String, Object>>> produitsFallback() {
        Map<String, Object> produit = Map.of(
                "id", -1,
                "nom", "Produit indisponible (fallback)",
                "prix", 0,
                "message", "Réponse fournie par la Gateway (Resilience4J)"
        );
        return ResponseEntity.ok(List.of(produit));
    }

    @GetMapping("/fallback/commandes")
    public ResponseEntity<List<Map<String, Object>>> commandesFallback() {
        Map<String, Object> commande = Map.of(
                "id", -1,
                "description", "Commande indisponible (fallback)",
                "quantite", 0,
                "montant", 0,
                "message", "Réponse fournie par la Gateway (Resilience4J)"
        );
        return ResponseEntity.ok(List.of(commande));
    }
}
