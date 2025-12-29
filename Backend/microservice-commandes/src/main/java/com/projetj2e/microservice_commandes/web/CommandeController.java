package com.projetj2e.microservice_commandes.web;

import com.projetj2e.microservice_commandes.entity.Commande;
import com.projetj2e.microservice_commandes.service.CommandeService;
import org.springframework.web.bind.annotation.*;
import com.projetj2e.microservice_commandes.config.CommandesProperties;

import java.util.List;

@RestController
@RequestMapping("/commandes")
public class CommandeController {

    private final CommandeService service;
    private final CommandesProperties props;

    public CommandeController(CommandeService service, CommandesProperties props) {
        this.service = service;
        this.props = props;
    }

    // GET /commandes : liste de toutes les commandes
    @GetMapping
    public List<Commande> getAll() {
        return service.findAll();
    }

    // GET /commandes/{id} : une seule commande
    @GetMapping("/{id}")
    public Commande getById(@PathVariable Long id) {
        return service.findById(id);
    }

    // POST /commandes : créer une commande
    @PostMapping
    public Commande create(@RequestBody Commande commande) {
        return service.save(commande);
    }

    // PUT /commandes/{id} : modifier une commande
    @PutMapping("/{id}")
    public Commande update(@PathVariable Long id, @RequestBody Commande c) {
        Commande existing = service.findById(id);
        if (existing == null) {
            return null;
        }
        existing.setDescription(c.getDescription());
        existing.setQuantite(c.getQuantite());
        existing.setDate(c.getDate());
        existing.setMontant(c.getMontant());
        existing.setIdProduit(c.getIdProduit()); // ← LIGNE AJOUTÉE pour mettre à jour l'ID produit
        return service.save(existing);
    }

    // DELETE /commandes/{id} : supprimer une commande
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    
    // GET /commandes/last : commandes des N derniers jours
    @GetMapping("/last")
    public List<Commande> getLastCommandes() {
        int n = props.getCommandesLast();
        return service.findLastNDays(n);
    }
}