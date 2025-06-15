# Infrastructure Multi-Services avec Terraform + Docker

Ce projet déploie une infrastructure locale complète avec trois services conteneurisés :
- **Frontend** : Application React avec Tailwind CSS
- **Backend** : API REST Node.js/Express
- **Base de données** : MySQL 8.0 avec scripts d'initialisation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │    │   (Node.js)     │    │   (MySQL)       │
│   Port: 3001    │────│   Port: 3000    │────│   Port: 3306    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Démarrage rapide

### Prérequis
- [Terraform](https://terraform.io) installé
- [Docker](https://docker.com) installé et démarré
- Ports 3000, 3001, 3306 disponibles

### Installation et déployement

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd terraform/
   ```

2. **Initialiser Terraform**
   ```bash
   terraform init
   ```

3. **Planifier le déploiement**
   ```bash
   terraform plan
   ```

4. **Déployer l'infrastructure**
   ```bash
   terraform apply
   ```
   Tapez `yes` pour confirmer le déploiement.

5. **Vérifier les services**
   ```bash
   terraform output
   ```

## 🔧 Configuration

### Variables Terraform

Vous pouvez personnaliser les ports et la configuration dans `variables.tf` :

```hcl
variable "frontend_port" {
  default = 3001
}

variable "backend_port" {
  default = 3000
}

variable "mysql_port" {
  default = 3306
}
```

### Variables d'environnement personnalisées

Créez un fichier `terraform.tfvars` pour personnaliser la configuration :

```hcl
frontend_port = 8080
backend_port = 8081
mysql_port = 3307
mysql_root_password = "monmotdepasse"
mysql_database = "madatabase"
```

## 📊 Services déployés

### Frontend (React)
- **URL** : http://localhost:3001
- **Framework** : React + TypeScript + Vite
- **Styling** : Tailwind CSS
- **Fonctionnalités** :
  - Interface utilisateur moderne
  - Gestion des tâches
  - Statistiques en temps réel
  - Design responsive

### Backend (Node.js)
- **URL** : http://localhost:3000
- **Framework** : Express.js
- **Base de données** : MySQL avec connexion poolée
- **Endpoints** :
  - `GET /api/health` - Statut du service
  - `GET /api/users` - Liste des utilisateurs
  - `GET /api/tasks` - Liste des tâches
  - `POST /api/tasks` - Créer une tâche
  - `PUT /api/tasks/:id` - Modifier une tâche
  - `DELETE /api/tasks/:id` - Supprimer une tâche
  - `GET /api/stats` - Statistiques

### Base de données (MySQL)
- **Host** : localhost:3306
- **Database** : appdb
- **User** : appuser
- **Tables** :
  - `users` - Utilisateurs
  - `tasks` - Tâches
  - `categories` - Catégories
  - `task_categories` - Relations tâches-catégories

## 🗄️ Base de données

### Schéma initial

Le script `docker/database/init.sql` crée automatiquement :
- Les tables nécessaires
- Un utilisateur `appuser` avec les permissions appropriées
- Des données de test pour le développement

### Connexion à la base

```bash
docker exec -it mysql-db mysql -u appuser -p appdb
```

## 🛠️ Commandes utiles

### Gestion Terraform
```bash
# Voir l'état actuel
terraform show

# Voir les outputs
terraform output

# Détruire l'infrastructure
terraform destroy
```

### Gestion Docker
```bash
# Voir les conteneurs
docker ps

# Voir les logs
docker logs app-frontend
docker logs app-backend
docker logs mysql-db

# Redémarrer un service
docker restart app-frontend
```

### Développement
```bash
# Reconstruire les images
terraform apply -replace=docker_image.frontend
terraform apply -replace=docker_image.backend

# Accéder aux conteneurs
docker exec -it app-frontend sh
docker exec -it app-backend sh
docker exec -it mysql-db bash
```

## 🔍 Monitoring

### Vérification de santé des services

```bash
# Backend API
curl http://localhost:3000/api/health

# Frontend (doit retourner du HTML)
curl http://localhost:3001

# Base de données
docker exec mysql-db mysqladmin ping -h localhost
```

### Logs des services

```bash
# Tous les logs
docker-compose logs -f

# Logs spécifiques
docker logs -f app-backend
docker logs -f mysql-db
```

## 🚨 Dépannage

### Problèmes courants

1. **Port déjà utilisé**
   ```bash
   # Changer les ports dans variables.tf
   variable "frontend_port" { default = 8080 }
   ```

2. **Erreur de connexion à la base**
   - Vérifier que MySQL est démarré : `docker ps`
   - Attendre l'initialisation complète (~30 secondes)

3. **Images Docker non trouvées**
   ```bash
   terraform apply -replace=docker_image.frontend
   terraform apply -replace=docker_image.backend
   ```

## 📁 Structure du projet

```
terraform/
├── main.tf              # Configuration principale
├── variables.tf         # Variables configurables
├── outputs.tf          # Outputs Terraform
├── README.md           # Documentation
└── docker/
    ├── frontend/       # Application React
    │   ├── Dockerfile
    │   ├── package.json
    │   └── src/
    ├── backend/        # API Node.js
    │   ├── Dockerfile
    │   ├── package.json
    │   └── server.js
    └── database/       # Scripts MySQL
        └── init.sql
```

## 🎯 Fonctionnalités

- ✅ 3 conteneurs Docker distincts
- ✅ Ports configurables via variables Terraform
- ✅ Scripts d'initialisation SQL automatisés
- ✅ Utilisateur de base de données créé automatiquement
- ✅ Outputs Terraform avec URLs des services
- ✅ Interface utilisateur moderne et responsive
- ✅ API REST complète avec gestion d'erreurs
- ✅ Base de données relationnelle avec données de test

## 🔐 Sécurité

- Utilisateur MySQL dédié avec permissions limitées
- Mots de passe configurables via variables
- Conteneurs non-root pour la sécurité
- Réseau Docker isolé pour les communications internes

## 📈 Évolutions possibles

- Ajout de Redis pour le cache
- Intégration de tests automatisés
- Déploiement sur AWS/Azure avec Terraform
- Monitoring avec Prometheus/Grafana
- HTTPS avec Let's Encrypt