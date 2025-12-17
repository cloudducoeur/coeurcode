![](img/logo.png)

CoeurCode est une application Next.js permettant de générer des QR codes personnalisés avec des presets pour les Restos du Cœur, Radio Restos, Les Enfoirés, et plus encore.

![](img/capture.png)

## Fonctionnalités

- Génération de QR codes arrondis
- Choix de presets (couleur, logo)
- Mode personnalisé (couleur/logo)
- Téléchargement et copie du QR code
- Sélection de la taille
- Mode sombre
- Suivi du nombre de scans par lien
- Statistiques visuelles
- Export des métriques pour Prometheus

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

L'application fonctionne avec une base de données PostgreSQL. Il est recommandé d'utiliser Docker Compose pour lancer la stack complète.

1. (Optionnel) Modifiez les identifiants de base de données dans `docker-compose.yml`.
2. Lancez les conteneurs :

```bash
docker-compose up -d --build
```

L'application sera accessible sur [http://localhost:3001](http://localhost:3001).
Les métriques sont disponibles sur [http://localhost:3001/metrics](http://localhost:3001/metrics).

## Monitoring

L'application expose des métriques au format Prometheus sur l'endpoint `/metrics`.

Exemple de sortie :

```text
# HELP qrcode_scans_total Total number of QR code scans
# TYPE qrcode_scans_total counter
qrcode_scans_total{short_code="TtdL5j",target_url="https://www.restosducoeur.org/"} 1
```

## Aller plus loin

### Ajouter un nouveau preset personnalisé

Pour ajouter un nouveau preset de QR code :

1. Ouvrez le fichier `src/types/preset.ts`.
2. Ajoutez un nouvel objet dans le tableau `presets` avec les propriétés suivantes :

```typescript
{
  id: 'mon-id', // identifiant unique
  name: 'Nom du preset', // affiché dans l’interface
  color: '#HEX', // couleur principale du QR code
  backgroundColor: '#HEX', // couleur de fond
  logoUrl: 'https://url/logo.png', // (optionnel) URL du logo
  logoWidth: 50, // (optionnel) largeur du logo
  logoHeight: 50 // (optionnel) hauteur du logo
}
```

3. Enregistrez le fichier. Le preset apparaîtra automatiquement dans l’interface.

Exemple :

```typescript
{
  id: 'nouveau-preset',
  name: 'Mon Nouveau Preset',
  color: '#FF9900',
  backgroundColor: '#FFFFFF',
  logoUrl: 'https://exemple.com/logo.png',
  logoWidth: 50,
  logoHeight: 50
}
```

## Licence

Projet sous licence GPLv3.
Développé par l'équipe du [Cloud du Cœur](https://cloudducoeur.org/).
