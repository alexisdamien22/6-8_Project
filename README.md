# 6-8_Project

## Installation et démarrage

1. Installer les dépendances :

```bash
npm install
```

2. Démarrer le serveur :

```bash
npm start
```

3. Ouvrir dans le navigateur :

```
http://localhost:3000
```

## 🚀 Fonctionnalités PWA

Cette application est maintenant une Progressive Web App (PWA) avec :

- **Installation** : Peut être installée comme une app native
- **Offline** : Fonctionne sans connexion internet (cache des ressources)
- **Rapide** : Chargement instantané après la première visite

### Installation de la PWA

#### Sur Chrome/Chromium :

1. Ouvrir `http://localhost:3000`
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou aller dans les paramètres → "Installer Six-Huit"

#### Sur Firefox :

1. Ouvrir `http://localhost:3000`
2. Aller dans le menu (⋮) → "Installer cette application"

#### Sur Safari (iOS) :

1. Ouvrir `http://localhost:3000`
2. Appuyer sur le bouton de partage
3. Sélectionner "Ajouter à l'écran d'accueil"

### Fonctionnalités offline

Une fois installée, l'application fonctionne même sans connexion internet grâce au Service Worker qui met en cache :

- L'interface principale
- Les styles CSS
- Les images et icônes
- Les fichiers JavaScript

## 📱 Utilisation

- Navigation entre les pages : Accueil, Podium, Musique, Menu
- Clic sur les étapes pour voir les leçons
- Bouton "COMMENCER" pour démarrer une leçon

## 🛠️ Technologies

- **Frontend** : HTML, CSS, JavaScript (MVC)
- **Backend** : Node.js + Express
- **PWA** : Service Worker + Web App Manifest
