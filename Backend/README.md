# Projet J2E – Microservices Spring Cloud

## 1. Équipe de développement

**Zainab Moussaif – Saad Qouhafa**

* Filière : 5IIR-11
* Année universitaire : 2025–2026

## 2. Introduction

Ce projet regroupe deux études de cas réalisées dans le cadre du module J2EE dédié à l’architecture microservices.

L’étude 1 porte sur la mise en place d’un premier microservice avec configuration externalisée.
L’étude 2 étend cette base pour construire une architecture distribuée intégrant :

* un serveur de configuration centralisé,
* un service de découverte,
* plusieurs microservices métiers,
* une API Gateway unique,
* un mécanisme de résilience et de répartition de charge,
* une documentation automatique via OpenAPI / Swagger.

---

# Partie I – Étude de cas 1

## 1. Architecture du projet

```text
projet-j2e/
 ├── config-server/
 ├── microservice-commandes/
 └── README.md
```

## Technologies utilisées

* Java 17
* Spring Boot 3.x
* Spring Cloud 2024.x
* H2 Database
* Maven
* GitHub
* Postman

## 2. Microservice `microservice-commandes`

Le microservice gère des opérations CRUD sur la table COMMANDE.

### Structure de la table

| Champ       | Type      |
| ----------- | --------- |
| id          | Long      |
| description | String    |
| quantite    | Integer   |
| date        | LocalDate |
| montant     | Double    |

## 3. Configuration externalisée

La configuration provient du dépôt GitHub :

[https://github.com/moussaifzainab/projet-j2e-config](https://github.com/moussaifzainab/projet-j2e-config)

### Exemple de fichier `microservice-commandes.properties`

```properties
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true
spring.datasource.url=jdbc:h2:mem:commandesdb
management.endpoints.web.exposure.include=*
mes-config-ms.commandes-last=10
```

### Rechargement dynamique

```
POST http://localhost:8081/actuator/refresh
```

## 4. Supervision Actuator

```
GET http://localhost:8081/actuator/health
```

Un `HealthIndicator` ajuste l’état du microservice selon le contenu de la table.

## 5. Endpoints principaux

| Méthode | Endpoint        | Description            |
| ------- | --------------- | ---------------------- |
| POST    | /commandes      | Ajouter une commande   |
| GET     | /commandes      | Liste des commandes    |
| GET     | /commandes/{id} | Détail d’une commande  |
| DELETE  | /commandes/{id} | Supprimer une commande |
| GET     | /commandes/last | Commandes récentes     |

## 6. Instructions de déploiement

* H2 Console : [http://localhost:8081/h2-console](http://localhost:8081/h2-console)
* Actuator : [http://localhost:8081/actuator/health](http://localhost:8081/actuator/health)
* API Commandes : [http://localhost:8081/commandes](http://localhost:8081/commandes)

---

# Partie II – Étude de cas 2

## 1. Objectif

L’étude 2 met en place une architecture microservices complète intégrant :

* un Config Server,
* un Eureka Server,
* deux microservices métiers,
* une Gateway comme point d’entrée unique,
* un mécanisme de load balancing,
* un mécanisme de résilience basé sur Resilience4J,
* une documentation automatique OpenAPI / Swagger.

## 2. Schéma d’architecture

```text
                       Dépôt GitHub de configuration
                                      │
                                      ▼
                           CONFIG-SERVER (9101)
                                      │
                                      ▼
        ---------------------------------------------------------------
        │                        │                       │
        ▼                        ▼                       ▼
MICROSERVICE-COMMANDES   MICROSERVICE-PRODUITS    GATEWAY-SERVER (9103)
      (8081)                   (9001)                        │
        │                        │                          │
        └----------- Enregistrement dans Eureka (9102) -----┘
                                      │
                                      ▼
                               EUREKA-SERVER
```

La Gateway constitue le point d’entrée unique pour les accès aux microservices.

## 3. Microservice `microservice-produits`

Structure de la table PRODUIT :

| Champ | Type   |
| ----- | ------ |
| id    | Long   |
| nom   | String |
| prix  | Double |

Endpoints :

* GET `/produits`
* GET `/produits/{id}`
* POST `/produits`
* DELETE `/produits/{id}`

## 4. Microservice `microservice-commandes` (version 2)

Nouvelle structure :

| Champ       | Type      |
| ----------- | --------- |
| id          | Long      |
| description | String    |
| quantite    | Integer   |
| date        | LocalDate |
| montant     | Double    |
| id_produit  | Long      |

## 5. Enregistrement dans Eureka

Les services visibles dans Eureka :

* **MICROSERVICE-COMMANDES**
* **MICROSERVICE-PRODUITS**
* **GATEWAY-SERVER**

Tableau de bord : [http://localhost:9102](http://localhost:9102)

## 6. API Gateway

La Gateway assure :

* le routage,
* la résolution dynamique via Eureka,
* le load balancing,
* les mécanismes de résilience (circuit breaker et fallback).

### Mapping principal

| Chemin Gateway | Microservice ciblé     |
| -------------- | ---------------------- |
| /produits/**   | microservice-produits  |
| /commandes/**  | microservice-commandes |

### Endpoints de test Resilience4J

| Endpoint            | Fonction                                   |
| ------------------- | ------------------------------------------ |
| /cb/produits        | Test Gateway + Resilience4J vers Produits  |
| /cb/commandes       | Test Gateway + Resilience4J vers Commandes |
| /fallback/produits  | Réponse de secours Produits                |
| /fallback/commandes | Réponse de secours Commandes               |

## 7. Load Balancing

Dès que la Gateway utilise les noms logiques des services, Spring Cloud LoadBalancer distribue les requêtes entre les instances disponibles.

## 8. Tableau récapitulatif des URLs

### Services techniques

| Fonction         | URL                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Eureka Dashboard | [http://localhost:9102](http://localhost:9102)                                                               |
| Config Commandes | [http://localhost:9101/microservice-commandes/default](http://localhost:9101/microservice-commandes/default) |
| Config Produits  | [http://localhost:9101/microservice-produits/default](http://localhost:9101/microservice-produits/default)   |
| Config Gateway   | [http://localhost:9101/gateway-server/default](http://localhost:9101/gateway-server/default)                 |

### Microservices (accès direct)

| Service   | URL                                                                |
| --------- | ------------------------------------------------------------------ |
| Commandes | [http://localhost:8081/commandes](http://localhost:8081/commandes) |
| Produits  | [http://localhost:9001/produits](http://localhost:9001/produits)   |

### Via la Gateway

| Service via Gateway | URL                                                                |
| ------------------- | ------------------------------------------------------------------ |
| Commandes           | [http://localhost:9103/commandes](http://localhost:9103/commandes) |
| Produits            | [http://localhost:9103/produits](http://localhost:9103/produits)   |

### Tests Resilience4J

| Test      | URL                                                                      |
| --------- | ------------------------------------------------------------------------ |
| Commandes | [http://localhost:9103/cb/commandes](http://localhost:9103/cb/commandes) |
| Produits  | [http://localhost:9103/cb/produits](http://localhost:9103/cb/produits)   |

### Supervision Actuator

| Service   | URL                                                                            |
| --------- | ------------------------------------------------------------------------------ |
| Gateway   | [http://localhost:9103/actuator/health](http://localhost:9103/actuator/health) |
| Commandes | [http://localhost:8081/actuator/health](http://localhost:8081/actuator/health) |
| Produits  | [http://localhost:9001/actuator/health](http://localhost:9001/actuator/health) |


## 9. Documentation OpenAPI / Swagger

Les documentations sont générées automatiquement pour chaque service.

### Microservice Commandes

* OpenAPI : [http://localhost:8081/v3/api-docs](http://localhost:8081/v3/api-docs)
* Swagger UI : [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)

### Microservice Produits

* OpenAPI : [http://localhost:9001/v3/api-docs](http://localhost:9001/v3/api-docs)
* Swagger UI : [http://localhost:9001/swagger-ui/index.html](http://localhost:9001/swagger-ui/index.html)

### Gateway

* OpenAPI : [http://localhost:9103/v3/api-docs](http://localhost:9103/v3/api-docs)
* Swagger UI : [http://localhost:9103/swagger-ui/index.html](http://localhost:9103/swagger-ui/index.html)


## 10. Procédure de lancement

1. Démarrer le Config Server
2. Démarrer Eureka
3. Démarrer la Gateway
4. Démarrer le microservice Commandes
5. Démarrer le microservice Produits

L’ordre garantit la bonne découverte des services dans Eureka.


## 11. Conclusion générale

Cette deuxième étude de cas a permis de construire une architecture microservices complète intégrant une configuration centralisée, un registre de service, un point d’entrée unique pour les communications, un mécanisme de résilience et une documentation automatique.
L’ensemble constitue une base solide et extensible pour des évolutions futures telles que la gestion avancée des erreurs, la montée en charge ou l’observabilité.


