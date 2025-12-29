package com.projetj2e.microservice_produits.web;

import com.projetj2e.microservice_produits.entity.Produit;
import com.projetj2e.microservice_produits.repository.ProduitRepository;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/produits")
public class ProduitController {

    private final ProduitRepository repository;

    public ProduitController(ProduitRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Produit> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Produit findById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public Produit create(@RequestBody Produit produit) {
        return repository.save(produit);
    }

    @PutMapping("/{id}")
    public Produit update(@PathVariable Long id, @RequestBody Produit produit) {
        produit.setId(id);
        return repository.save(produit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
