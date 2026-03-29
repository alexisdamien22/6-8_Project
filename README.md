# 🎵 Six-Huit | Apprentissage Musical

Une application web ludique et interactive destinée à accompagner les enfants (6-8 ans) dans leur apprentissage musical au quotidien.

Ce projet est construit sur une architecture **MVC (Modèle-Vue-Contrôleur)** stricte en Vanilla JavaScript côté client, propulsée par une API RESTful **Node.js / Express** et une base de données **MySQL**.

## 🚀 Fonctionnalités principales

- **Parcours d'apprentissage interactif** : Suivi visuel des leçons quotidiennes.
- **Système de Streaks (Séries)** : Gamification pour encourager la pratique régulière (flammes dynamiques).
- **Profils enfants personnalisables** : Choix de mascottes, instruments (Guitare, Violon, Flûte, etc.) et jours de pratique.
- **Comptes Parents / Enfants** : Sécurisation par JWT et gestion des permissions.
- **Support PWA (Progressive Web App)** : Utilisable hors-ligne grâce au Service Worker (`sw.js`).
- **Mode Sombre / Clair** : Support natif avec persistance des préférences.

## 🛠️ Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla ES6+), Architecture MVC
- **Backend** : Node.js, Express.js
- **Base de données** : MySQL (via `mysql2/promise`)
- **Sécurité** : JWT (JSON Web Tokens), `bcryptjs`, variables d'environnement (`dotenv`)

## ⚙️ Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (v16 ou supérieur)
- [MySQL](https://www.mysql.com/) (v8 ou supérieur)

## 📦 Installation et Lancement

**1. Cloner le projet et installer les dépendances**
\`\`\`bash
git clone <[repo-github](https://github.com/alexisdamien22/6-8_Project.git)>
cd 6-8_Project-betterConnection
npm install

# Installation des dépendances de production

npm install express mysql2 dotenv bcryptjs jsonwebtoken

# Installation de la dépendance de développement

npm install --save-dev nodemon
\`\`\`

**2. Configurer la base de données**

- Créez une base de données nommée `six_huit_production` dans MySQL.
- Importez le fichier de structure fourni :
  \`\`\`bash
  mysql -u root -p six_huit_production < public/data/6_8_production.sql
  \`\`\`

**3. Configurer les variables d'environnement**

- Créez un fichier `.env` à la racine du projet et ajoutez-y vos informations :
  \`\`\`env
  PORT=3000
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=votre_mot_de_passe
  DB_NAME=six_huit_production
  JWT_SECRET=votre_cle_secrete_super_securisee
  \`\`\`

**4. Démarrer le serveur**

- Pour le développement (avec rechargement automatique via Nodemon) :
  \`\`\`bash
  npm run dev
  \`\`\`
- Pour la production :
  \`\`\`bash
  npm start
  \`\`\`

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## 📁 Architecture du projet

\`\`\`text
├── public/ # Fichiers statiques exposés (CSS, Images, SQL)
├── src/
│ ├── constants/ # Constantes de l'application
│ ├── controller/ # Contrôleurs MVC (Logique de navigation et d'orchestration)
│ ├── db/ # Connexion à la base de données MySQL
│ ├── managers/ # Gestionnaires de données (Requêtes SQL)
│ ├── model/ # Modèles MVC (Gestion des données et état global)
│ ├── routes/ # Routes de l'API REST Express
│ ├── utils/ # Fonctions utilitaires (Helpers, formatage)
│ └── view/ # Vues MVC (Génération du HTML et écouteurs d'événements)
├── .env # Variables d'environnement (à créer)
├── index.html # Point d'entrée de la Single Page Application (SPA)
├── server.js # Point d'entrée du serveur Node.js
└── sw.js # Service Worker pour la PWA
\`\`\`
