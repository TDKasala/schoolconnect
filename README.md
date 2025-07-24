# SchoolConnect - Plateforme de Gestion Scolaire

Une solution SaaS moderne de gestion scolaire conçue spécifiquement pour les écoles de la République Démocratique du Congo.

## 🚀 Fonctionnalités

### Modules Principaux
- **POSP (Pédagogie)** - Gestion des classes, notes et évaluations
- **UBank (Finances)** - Gestion financière et comptabilité scolaire
- **Portails Connectés** - Communication entre école, enseignants et parents

### Rôles Utilisateurs
- **Administrateur Plateforme** - Gestion complète de toutes les écoles
- **Administrateur École** - Gestion d'une école spécifique
- **Enseignant** - Gestion des classes et notes
- **Parent** - Suivi des progrès de l'enfant

## 🛠️ Stack Technique

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS avec animations personnalisées
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/TDKasala/schoolconnect.git
cd schoolconnect

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 🌐 Déploiement sur Vercel

### Déploiement Automatique
1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement la configuration Vite
3. Le déploiement se fera automatiquement à chaque push

### Déploiement Manuel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel --prod
```

### Variables d'Environnement
Aucune variable d'environnement requise pour le moment (application frontend statique).

## 🎨 Design System

### Couleurs Principales
- **Primary**: Bleu (#2563eb)
- **Secondary**: Vert (#16a34a)
- **Accent**: Violet (#7c3aed)

### Animations
- Animations CSS personnalisées pour les blobs flottants
- Transitions fluides avec Tailwind
- Micro-interactions sur les éléments interactifs

## 📱 Responsive Design

L'application est optimisée pour :
- 📱 Mobile (320px+)
- 📟 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🔧 Configuration Vercel

Le fichier `vercel.json` inclut :
- Configuration de build Vite
- Rewrites pour SPA routing
- Headers de cache optimisés
- Support des assets statiques

## 🚀 Performance

### Optimisations
- ✅ Bundle splitting automatique avec Vite
- ✅ Lazy loading des composants
- ✅ Compression des assets
- ✅ Cache headers optimisés
- ✅ Images optimisées pour le web

### Métriques Cibles
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 📄 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── auth/           # Composants d'authentification
│   ├── dashboard/      # Composants du tableau de bord
│   └── layout/         # Header, Footer, Layout
├── contexts/           # Contexts React (Auth, etc.)
├── pages/             # Pages de l'application
│   ├── auth/          # Pages d'authentification
│   ├── dashboard/     # Pages du tableau de bord
│   └── public/        # Pages publiques
├── types/             # Types TypeScript
├── utils/             # Utilitaires
└── index.css          # Styles globaux et animations
```

## 🔐 Authentification

Système d'authentification basé sur :
- Context API pour la gestion d'état
- LocalStorage pour la persistance
- Routes protégées avec PrivateRoute
- Gestion des rôles utilisateurs

## 🌍 Optimisations RDC

### Connexions Lentes
- ✅ Bundle size optimisé
- ✅ Lazy loading des composants
- ✅ Compression des assets
- ✅ Cache agressif des ressources

### Interface Française
- ✅ Interface entièrement en français
- ✅ Formats de date/heure locaux
- ✅ Devise locale (Franc Congolais)

## 📞 Support

Pour toute question ou support :
- 📧 Email: support@schoolconnect.cd
- 📱 Téléphone: +243 XXX XXX XXX
- 🌐 Site web: https://schoolconnect.vercel.app

## 📝 Licence

© 2024 SchoolConnect. Tous droits réservés.

---

**Développé avec ❤️ pour l'éducation en RDC**
