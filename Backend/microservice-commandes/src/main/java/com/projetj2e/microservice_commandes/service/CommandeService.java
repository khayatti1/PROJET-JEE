package com.projetj2e.microservice_commandes.service;

import com.projetj2e.microservice_commandes.entity.Commande;
import com.projetj2e.microservice_commandes.repository.CommandeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CommandeService {

    private final CommandeRepository repo;

    public CommandeService(CommandeRepository repo) {
        this.repo = repo;
    }

    public List<Commande> findAll() {
        return repo.findAll();
    }

    public Commande findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Commande save(Commande c) {
        if (c.getDate() == null) {
            c.setDate(LocalDate.now());
        }
        return repo.save(c);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
    
    public List<Commande> findLastNDays(int n) {
        LocalDate minDate = LocalDate.now().minusDays(n);
        return repo.findByDateAfter(minDate);
    }
}
