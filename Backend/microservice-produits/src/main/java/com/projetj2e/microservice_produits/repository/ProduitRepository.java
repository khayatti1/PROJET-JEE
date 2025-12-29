package com.projetj2e.microservice_produits.repository;

import com.projetj2e.microservice_produits.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
}
