# CoeurCode

CoeurCode est une application Next.js permettant de générer des QR codes personnalisés avec des presets pour les Restos du Cœur, Radio Restos, Les Enfoirés, et plus encore.

![](img/capture.png)

## Fonctionnalités

- Génération de QR codes arrondis
- Choix de presets (couleur, logo)
- Mode personnalisé (couleur/logo)
- Téléchargement et copie du QR code
- Sélection de la taille
- Mode sombre

## Utilisation

### Installation

```bash
npm install
```

### Lancement en développement

```bash
npm run dev
```

### Lancement en production (Docker)

```bash
docker build -t coeurcode .
docker run -p 3000:3000 coeurcode
```

## Licence

Projet sous licence GPLv3. Développé par Cloud du Cœur.
