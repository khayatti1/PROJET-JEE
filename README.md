# Projet J2EE - Architecture Microservices avec Spring Cloud et Frontend Next.js

## Équipe de développement

**EL KHAYATI Mohammed & MOUDID Mouad**

- Filière : 5IIR-11
- Année universitaire : 2025-2026

---

## Table des matières

1. [Introduction](#1-introduction)
2. [Architecture globale](#2-architecture-globale)
3. [Technologies utilisées](#3-technologies-utilisées)
4. [Backend - Spring Cloud Microservices](#4-backend---spring-cloud-microservices)
5. [Frontend - Next.js Application](#5-frontend---nextjs-application)
6. [Installation et démarrage](#6-installation-et-démarrage)
7. [Tests et validation](#7-tests-et-validation)
8. [Conclusion](#8-conclusion)

---

## 1. Introduction

Ce projet implémente une architecture microservices complète pour la gestion de produits et de commandes. Il démontre les concepts clés des architectures distribuées modernes :

- **Configuration centralisée** : Gestion unifiée de toutes les configurations
- **Service Discovery** : Découverte automatique des services
- **API Gateway** : Point d'entrée unique pour tous les services
- **Résilience** : Circuit breakers et fallbacks pour la tolérance aux pannes
- **Load Balancing** : Distribution automatique de la charge
- **Interface moderne** : Frontend React/Next.js avec design responsive

### Objectifs du projet

- Construire une architecture microservices scalable et résiliente
- Implémenter les patterns Spring Cloud (Config, Eureka, Gateway)
- Développer une interface utilisateur moderne et intuitive
- Assurer l'intégrité référentielle entre les entités
- Documenter automatiquement les API avec OpenAPI/Swagger

---

## 2. Architecture globale

### 2.1 Schéma d'architecture Backend

```
                    GitHub Configuration Repository
                                 │
                                 ▼
                      CONFIG SERVER (Port 9101)
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
         EUREKA SERVER (Port 9102)    Configuration Distribution
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
PRODUITS        COMMANDES      GATEWAY
(Port 9001)     (Port 8081)   (Port 9103)
    │               │               │
    └───────────────┴───────────────┘
                    │
                    ▼
            Service Registration
                    │
                    ▼
          FRONTEND NEXT.JS (Port 3000)
```

### 2.2 Flux de communication

1. **Configuration** : Les microservices récupèrent leur configuration depuis Config Server au démarrage
2. **Enregistrement** : Chaque microservice s'enregistre auprès d'Eureka Server
3. **Découverte** : Gateway découvre les services disponibles via Eureka
4. **Routage** : Gateway route les requêtes frontend vers les microservices appropriés
5. **Résilience** : En cas d'échec, les circuit breakers activent les fallbacks

---

## 3. Technologies utilisées

### 3.1 Backend

| Technologie | Version | Rôle |
|------------|---------|------|
| Java | 17 | Langage de programmation |
| Spring Boot | 3.x | Framework de développement |
| Spring Cloud | 2024.x | Suite microservices |
| Spring Cloud Config | 2024.x | Configuration centralisée |
| Spring Cloud Gateway | 2024.x | API Gateway |
| Resilience4J | Latest | Circuit Breaker |
| H2 Database | Latest | Base de données en mémoire |
| SpringDoc OpenAPI | Latest | Documentation API |
| Maven | 3.x | Gestion des dépendances |
| Lombok | Latest | Réduction du code boilerplate |

### 3.2 Frontend

| Technologie | Version | Rôle |
|------------|---------|------|
| Next.js | 16.x | Framework React avec SSR |
| React | 19.2 | Bibliothèque UI |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 4.x | Framework CSS |
| shadcn/ui | Latest | Composants UI |
| Lucide React | Latest | Icônes |
| date-fns | Latest | Manipulation de dates |

---

## 4. Backend - Spring Cloud Microservices

### 4.1 Config Server (Port 9101)

#### Description
Service responsable de la gestion centralisée de toutes les configurations. Il récupère les fichiers de configuration depuis un dépôt GitHub et les distribue aux microservices.

#### Configuration
| Propriété | Valeur |
|-----------|--------|
| Port | 9101 |
| Repository Git | https://github.com/khayatti1/projet-jee-config |
| Branch | main |

#### Endpoints
| URL | Description |
|-----|-------------|
| http://localhost:9101/microservice-commandes/default | Configuration du service Commandes |
| http://localhost:9101/microservice-produits/default | Configuration du service Produits |
| http://localhost:9101/gateway-server/default | Configuration du Gateway |

### 4.2 Eureka Server (Port 9102)

#### Description
Service de découverte qui permet aux microservices de s'enregistrer et de découvrir les autres services disponibles dans l'architecture.

#### Dashboard
- URL: http://localhost:9102
- Permet de visualiser tous les services enregistrés et leur statut

### 4.3 Microservice Produits (Port 9001)

#### Description
Gère les opérations CRUD sur les produits avec les fonctionnalités suivantes :
- Gestion complète des produits (CRUD)
- Intégration avec le service de commandes
- Documentation OpenAPI automatique

#### Endpoints REST
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /produits | Liste tous les produits |
| GET | /produits/{id} | Récupère un produit par ID |
| POST | /produits | Crée un nouveau produit |
| PUT | /produits/{id} | Met à jour un produit |
| DELETE | /produits/{id} | Supprime un produit |
| GET | /produits/search | Recherche de produits |

### 4.4 Microservice Commandes (Port 8081)

#### Description
Gère les commandes avec référence aux produits. Implémente un HealthIndicator personnalisé pour la supervision.

#### Endpoints REST
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /commandes | Liste toutes les commandes |
| GET | /commandes/{id} | Récupère une commande par ID |
| POST | /commandes | Crée une nouvelle commande |
| PUT | /commandes/{id} | Met à jour un commandes |
| DELETE | /commandes/{id} | Supprime une commande |


### 4.5 API Gateway (Port 9103)

#### Description
Point d'entrée unique pour toutes les requêtes frontend. Implémente :
- Routage dynamique via Eureka
- Load balancing automatique
- Circuit breaker avec Resilience4J
- Fallbacks pour la résilience

#### Endpoints de test Resilience4J
| Endpoint | Description |
|----------|-------------|
| GET /cb/produits | Test circuit breaker produits |
| GET /cb/commandes | Test circuit breaker commandes |
| GET /fallback/produits | Fallback produits |
| GET /fallback/commandes | Fallback commandes |

---

## 5. Frontend - Next.js Application

### 5.1 Architecture du Frontend

```
frontend/
├── app/                    # Pages Next.js 13+ (App Router)
│   ├── produits/          # Pages produits
│   ├── commandes/         # Pages commandes
│   ├── dashboard/         # Dashboard principal
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
│   ├── ui/               # Composants shadcn/ui
│   ├── produits/         # Composants produits
│   └── commandes/        # Composants commandes
├── lib/                   # Utilitaires et configurations
├── hooks/                 # Hooks React personnalisés
└── services/              # Services API
```

### 5.2 Fonctionnalités principales

#### Dashboard
- Vue d'ensemble des produits et commandes
- Graphiques de statistiques
- Notifications en temps réel

#### Gestion des produits
- Liste paginée des produits
- Formulaire de création/édition
- Calcul automatique des montants
- Historique des produits
- 
#### Gestion des commandes
- Interface de création de commandes
- Sélection de produits avec autocomplétion
- Calcul automatique des montants
- Historique des commandes

#### Fonctionnalités avancées
- Design responsive (mobile/desktop)
- Mode sombre/clair
- Internationalisation (i18n)
- Export PDF/Excel
- Notifications toast

---

## 6. Installation et démarrage

### 6.1 Prérequis

- Java 17+
- Node.js 18+
- Maven 3.8+
- Git

### 6.2 Backend

#### Étape 1: Cloner le dépôt
```bash
git clone https://github.com/khayatti1/projet-JEE.git
cd projet-JEE
```

#### Étape 2: Démarrer les services dans l'ordre
```bash
# 1. Config Server
cd config-server
mvn spring-boot:run

# 2. Eureka Server (nouveau terminal)
cd eureka-server
mvn spring-boot:run

# 3. Gateway (nouveau terminal)
cd gateway-server
mvn spring-boot:run

# 4. Microservice Produits (nouveau terminal)
cd microservice-produits
mvn spring-boot:run

# 5. Microservice Commandes (nouveau terminal)
cd microservice-commandes
mvn spring-boot:run
```

### 6.3 Frontend

#### Étape 1: Installation des dépendances
```bash
cd frontend
npm install
```

#### Étape 2: Configuration
Créer le fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:9103
NEXT_PUBLIC_WS_URL=ws://localhost:9103
```

#### Étape 3: Démarrer l'application
```bash
npm run dev
```

### 6.4 Vérification des services

| Service | URL | Statut |
|---------|-----|--------|
| Config Server | http://localhost:9101 | valide |
| Eureka Dashboard | http://localhost:9102 | valide |
| API Gateway | http://localhost:9103 | valide |
| Produits API | http://localhost:9001 | valide |
| Commandes API | http://localhost:8081 | valide |
| Frontend | http://localhost:3000 | valide |
| Swagger Produits | http://localhost:9001/swagger-ui.html | valide |
| Swagger Commandes | http://localhost:8081/swagger-ui.html | valide |

---

## 7. Tests et validation

### 7.1 Tests backend

#### Tests unitaires
```bash
cd microservice-produits
mvn test

cd microservice-commandes
mvn test
```

#### Tests d'intégration
```bash
# Tests avec Spring Boot Test
mvn verify

# Tests de résilience
curl http://localhost:9103/cb/produits
curl http://localhost:9103/cb/commandes
```

### 7.2 Tests frontend

#### Tests unitaires
```bash
cd frontend
npm run test
```

### 7.3 Validation des fonctionnalités

| Fonctionnalité | Test | Résultat attendu |
|---------------|------|------------------|
| Service Discovery | Vérifier Eureka Dashboard | Tous les services visibles |
| Circuit Breaker | Arrêter service Produits | Fallback activé |
| Load Balancing | Lancer multiples instances | Distribution des requêtes |
| Configuration dynamique | Modifier config Git | Refresh automatique |
| Intégrité données | Créer commande avec produit | Validation des références |

---

## 8. Conclusion

### 8.1 Réalisations

Ce projet a permis de mettre en œuvre une architecture microservices complète avec :

1. **Configuration centralisée** via Spring Cloud Config
2. **Service Discovery** avec Eureka Server
3. **API Gateway** unifiée avec routage intelligent
4. **Résilience** grâce à Resilience4J et Circuit Breaker
5. **Frontend moderne** avec Next.js 13+ et React
6. **Documentation automatique** des API avec OpenAPI
7. **Tests complets** (unitaires, intégration, E2E)

### 8.2 Points forts

- Architecture scalable et maintenable
- Découplage complet des services
- Interface utilisateur intuitive et responsive
- Tolérance aux pannes intégrée
- Documentation complète et automatique
- Pipeline de tests robuste

### 8.3 Perspectives d'évolution

1. **Sécurité** : Implémenter OAuth2/JWT avec Keycloak
2. **Monitoring** : Ajouter Prometheus et Grafana
3. **Logging distribué** : Implémenter ELK Stack
4. **CI/CD** : Automatiser le déploiement avec Jenkins/GitHub Actions
5. **Conteneurisation** : Docker et Kubernetes
6. **Messagerie** : Intégrer RabbitMQ/Kafka pour l'asynchrone
7. **Base de données** : Migrer vers PostgreSQL/MySQL

### 8.4 Rétrospective

Ce projet a été une excellente opportunité pour mettre en pratique les concepts avancés du développement d'applications distribuées. L'équipe a renforcé ses compétences en :

- Architecture microservices avec Spring Cloud
- Développement frontend moderne avec Next.js
- Patterns de résilience et de tolérance aux pannes
- Intégration continue et tests automatisés
- Travail collaboratif avec Git et méthodologies agiles

### 8.5 Conclusion Finale

Ce projet J2EE sur l'architecture microservices avec Spring Cloud et Next.js représente une implémentation complète et professionnelle des patterns modernes de développement d'applications distribuées. À travers la réalisation de cette plateforme de gestion de produits et commandes, nous avons démontré la maîtrise des concepts clés suivants :

**Sur le plan technique :**
- L'architecture microservices a été implémentée avec succès, offrant scalabilité et maintenabilité
- Les services Spring Cloud (Config, Eureka, Gateway) fonctionnent en parfaite synergie
- L'intégration frontend/backend est fluide grâce à une API Gateway bien conçue
- La résilience est assurée par des mécanismes robustes de circuit breaking

**Sur le plan pédagogique :**
- Le projet couvre l'ensemble du cycle de développement, du backend au frontend
- Les bonnes pratiques de développement (tests, documentation, versioning) ont été respectées
- L'application est entièrement fonctionnelle avec une interface utilisateur moderne

**Sur le plan professionnel :**
- L'architecture est prête pour la production avec possibilité d'extension
- La documentation technique est complète et précise
- Le code est structuré, lisible et maintenable

Ce projet constitue donc une base solide pour des développements futurs plus complexes et démontre notre capacité à concevoir et implémenter des solutions logicielles complètes suivant les standards industriels actuels.

---

## Captures d'écran de l'application

<img width="1919" height="1040" alt="1" src="https://github.com/user-attachments/assets/a1444ca7-03d9-4a53-a526-29133d1de340" />
<img width="1919" height="1041" alt="2" src="https://github.com/user-attachments/assets/62681ccd-044f-4593-b3f6-7f9eb9380322" />
<img width="1917" height="1040" alt="3" src="https://github.com/user-attachments/assets/34bd9499-b7a2-4bba-a0fa-6a5938bbeab2" />
<img width="1919" height="1040" alt="4" src="https://github.com/user-attachments/assets/a9cfaed7-72b7-4aba-8e39-1a96bcd8ca49" />
<img width="1919" height="1039" alt="5" src="https://github.com/user-attachments/assets/2564bfb4-0980-4d55-a72f-199b8c057f88" />
<img width="1919" height="1041" alt="6" src="https://github.com/user-attachments/assets/cf525a69-d08d-4f48-a246-fe5fe125b411" />
<img width="1919" height="1040" alt="7" src="https://github.com/user-attachments/assets/a675c64f-2500-45aa-a77b-2a445118c7aa" />
<img width="1919" height="1041" alt="8" src="https://github.com/user-attachments/assets/5f68b4f7-1348-4926-b67b-ad886f61f0ef" />

## Licence

Ce projet est développé à des fins éducatives dans le cadre du module J2EE.

## Contact

- **EL KHAYATI Mohammed** - khayatti.12@gmail.com
- **MOUDID Mouad** - mouadmoudid27@gmail.com

**Université** - Année universitaire 2025-2026
