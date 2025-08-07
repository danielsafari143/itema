# Site de Réservation d'Événements

Un site web de réservation d'événements simple et professionnel construit avec Node.js, Express.js, base de données fichier JSON et Bootstrap. Cette application permet aux utilisateurs de réserver trois types d'événements : Mariages, Anniversaires et Baptêmes.

## 🎯 Fonctionnalités

- **Trois Types d'Événements** : Services de réservation pour Mariage, Anniversaire et Baptême
- **Design Responsive** : Interface mobile-friendly utilisant Bootstrap 5
- **Validation de Formulaire** : Validation côté client et serveur
- **Prix Dynamiques** : Système de prix configurable par l'administrateur
- **Interface Professionnelle** : Design moderne et propre avec de belles images
- **Résumé de Réservation** : Page de confirmation détaillée avec informations de prix
- **Base de Données Fichier JSON** : Stockage persistant de toutes les données
- **Localisation Française** : Interface entièrement en français

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm (inclus avec Node.js)

## 🚀 Installation & Configuration

### 1. **Cloner ou télécharger les fichiers du projet**

### 2. **Installer les dépendances** :
```bash
npm install
```

### 3. **Configuration de la Base de Données Fichier JSON**

La base de données utilise des fichiers JSON pour stocker les données. Aucune configuration supplémentaire n'est nécessaire.

### 4. **Initialisation de la Base de Données** :
```bash
npm run db:setup
```

### 5. **Démarrer le serveur** :
```bash
npm start
```

### 6. **Pour le développement avec auto-redémarrage** :
```bash
npm run dev
```

### 7. **Ouvrir votre navigateur** et naviguer vers :
```
http://localhost:3000
```

## 📁 Structure du Projet

```
event-booking-website/
├── database/
│   ├── config.js              # Configuration base de données fichier
│   ├── setup.js               # Script d'initialisation DB
│   └── data/                  # Dossier des fichiers JSON
├── locales/
│   └── fr.js                  # Traductions françaises
├── public/
│   ├── css/
│   │   └── style.css          # Styles personnalisés
│   └── images/                # Assets d'images (si nécessaire)
├── views/
│   ├── index.ejs             # Page d'accueil
│   ├── wedding.ejs           # Page services mariage
│   ├── birthday.ejs          # Page services anniversaire
│   ├── baptism.ejs           # Page services baptême
│   ├── booking.ejs           # Formulaire de réservation
│   └── summary.ejs           # Résumé de réservation
├── app.js                    # Fichier serveur principal
├── config.env                # Variables d'environnement
├── package.json              # Dépendances et scripts
└── README.md                 # Ce fichier
```

## 🎨 Aperçu des Pages

### 1. Page d'Accueil (`/`)
- Section héro avec appel à l'action
- Trois cartes d'événements (Mariage, Anniversaire, Baptême)
- Affichage des prix dynamiques depuis la base de données
- Layout responsive

### 2. Pages d'Événements (`/wedding`, `/birthday`, `/baptism`)
- Descriptions détaillées des services
- Galeries photos
- Boutons "Réserver Maintenant"
- Mise en avant des services

### 3. Formulaire de Réservation (`/wedding/booking`, etc.)
- Champs d'informations de contact
- Détails de l'événement (date, invités)
- Validation de formulaire
- Design responsive

### 4. Page de Résumé (`/summary/:id`)
- Confirmation de réservation
- Affichage des détails de l'événement
- Informations de prix
- Informations sur les prochaines étapes

## ⚙️ Configuration

### Prix Administrateur
Les prix sont stockés dans les fichiers JSON et peuvent être modifiés via l'API ou directement dans les fichiers :

```bash
# Mettre à jour un prix via l'API
curl -X POST http://localhost:3000/admin/prices \
  -H "Content-Type: application/json" \
  -d '{"eventType": "wedding", "price": 600}'

# Ou modifier directement le fichier database/data/admin_prices.json
```

### Configuration du Port
Le serveur fonctionne sur le port 3000 par défaut. Pour le changer :

```javascript
const PORT = process.env.PORT || 3000;
```

## 🛠️ Personnalisation

### Ajouter de Nouveaux Types d'Événements
1. Ajouter une nouvelle route dans `app.js`
2. Créer un nouveau template EJS dans `views/`
3. Ajouter le prix dans la base de données
4. Mettre à jour la navigation dans tous les templates
5. Ajouter les traductions dans `locales/fr.js`

### Modifications de Style
- Styles principaux : `public/css/style.css`
- Classes Bootstrap utilisées dans tous les templates
- Variables CSS personnalisées et breakpoints responsives

### Images
- Utilisation actuelle d'images placeholder Unsplash
- Remplacer les URLs dans les templates par vos propres images
- Stocker les images locales dans `public/images/`

## 📱 Fonctionnalités Responsives

- Approche mobile-first
- Système de grille Bootstrap 5
- Navigation responsive
- Boutons et formulaires tactiles
- Optimisé pour toutes les tailles d'écran

## 🔒 Validation de Formulaire

### Validation Côté Client
- Validation des champs requis
- Validation du format email
- Validation de la plage de dates (dates futures uniquement)
- Limites du nombre d'invités (1-500)

### Validation Côté Serveur
- Traitement des données de formulaire
- Sanitisation des données
- Stockage en base de données

## 🎯 Fonctionnalités Administrateur

### Capacités Administrateur Actuelles
- Définir les prix pour chaque type d'événement
- Voir les soumissions de réservation (stockage en base de données)
- Configurer les types d'événements et services

### Extensions Potentielles
- Tableau de bord administrateur
- Notifications par email
- Traitement des paiements
- Système de gestion des réservations

## 🗄️ Base de Données Fichier JSON

### Fichiers Créés
- `database/data/bookings.json` : Stockage des réservations
- `database/data/admin_prices.json` : Configuration des prix

### Structure des Données (Prix en Dollars $)
```json
// bookings.json
[
  {
    "id": 1234567890,
    "event_type": "wedding",
    "full_name": "Jean Dupont",
    "phone": "0123456789",
    "email": "jean@example.com",
    "event_date": "2024-06-15",
    "guests": 100,
    "message": "Cérémonie en extérieur",
    "price": 500,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]

// admin_prices.json
[
  {
    "id": 1,
    "event_type": "wedding",
    "price": 500,
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 🌍 Localisation

L'application est entièrement localisée en français. Tous les textes sont stockés dans `locales/fr.js` et peuvent être facilement modifiés.

### Ajouter une Nouvelle Langue
1. Créer un nouveau fichier `locales/en.js` (par exemple)
2. Traduire tous les textes
3. Modifier `app.js` pour utiliser la nouvelle langue

## 🚀 Déploiement

### Développement Local
```bash
npm run dev
```

### Production
```bash
npm start
```

### Variables d'Environnement
- `PORT` : Port du serveur (défaut : 3000)
- Aucune autre variable d'environnement nécessaire

## 📞 Support

Pour les questions ou problèmes :
1. Vérifiez la console pour les messages d'erreur
2. Vérifiez que toutes les dépendances sont installées
3. Assurez-vous que la version de Node.js est compatible
4. Vérifiez les permissions et chemins de fichiers
5. Vérifiez les fichiers de données dans `database/data/`

## 🔄 Améliorations Futures

- Interface d'administration complète
- Notifications par email
- Intégration de passerelle de paiement
- Fonctionnalité de téléchargement d'images
- Système de calendrier de réservation
- Avis et évaluations clients
- Système d'authentification utilisateur
- API REST complète

## 📄 Licence

Ce projet est open source et disponible sous la licence MIT.

---

**Bonne Planification d'Événements ! 🎉**
