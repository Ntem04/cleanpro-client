# CleanPro – site vitrine

Application React, TypeScript et Vite du site vitrine CleanPro.

## Démarrage

Depuis la racine du workspace :

```sh
npm run dev:vitrine
```

Depuis ce dossier, les commandes suivantes sont disponibles :

```sh
npm run dev
npm run build
npm run lint
npm run preview
```

## Organisation du code

```text
src/
├── assets/                 # Ressources générales de l'application
├── components/
│   ├── layout/             # Navigation et pied de page partagés
│   └── ui/                 # Composants génériques et réutilisables
├── image/                  # Images utilisées par les pages
├── pages/
│   ├── about/
│   │   └── components/     # Sections propres à la page À propos
│   ├── contact/
│   │   └── components/     # Sections et composants propres au contact
│   ├── home/
│   │   └── components/     # Sections propres à l'accueil
│   ├── levels/
│   ├── login/
│   ├── not-found/
│   ├── quote/
│   ├── register/
│   ├── services/
│   └── testimonials/
│       └── components/
├── App.tsx                 # Routes et layout racine
├── index.css
└── main.tsx
```

Chaque page et ses composants spécifiques restent dans `src/pages/<page>/`.
Les composants destinés à être partagés entre plusieurs pages vont dans
`src/components/`. Pour ajouter une page, créer son dossier, son composant
principal, puis déclarer son chemin dans `src/App.tsx`.

## Performance de production

La commande `npm run build` produit une version minifiée avec :

- le découpage automatique de React, du routeur, des icônes, d'Axios et de
  Recharts en chunks indépendants et réutilisables par le cache navigateur ;
- le chargement différé des graphiques du tableau de bord, uniquement lorsque
  la vue d'ensemble est affichée ;
- la séparation CSS et la compression des ressources WebP déjà utilisées par
  les pages.

Pour vérifier la taille des ressources générées, inspecter le dossier `dist/`
après un build de production.
