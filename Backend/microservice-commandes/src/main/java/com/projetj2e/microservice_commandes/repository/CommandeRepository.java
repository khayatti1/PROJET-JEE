package com.projetj2e.microservice_commandes.repository;

import com.projetj2e.microservice_commandes.entity.Commande;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
	
	// Commandes dont la date est postérieure à dateMin
    List<Commande> findByDateAfter(LocalDate dateMin);
}
