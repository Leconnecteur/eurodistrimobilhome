# Euro Distri Mobilhome

Plateforme commerciale (site public + mini-CRM admin) pour Euro Distri Mobilhome :
achat, vente, reprise et distribution de mobil-homes d'occasion en France, Espagne
et Portugal.

## Stack

- **Next.js 16** (App Router, Turbopack), TypeScript strict
- **Tailwind CSS v4** + **shadcn/ui** (base-ui)
- **Firebase** : Authentication (admin), Firestore, Storage — via le SDK client
  uniquement, sécurisé par les Security Rules (`firestore.rules`, `storage.rules`)
- **Zod** pour la validation des formulaires
- **@react-pdf/renderer** + **qrcode** pour les fiches PDF commerciales
- **browser-image-compression** pour compresser les photos côté navigateur avant upload

## Démarrage

```bash
npm install
npm run dev
```

Le site est utilisable **sans Firebase configuré** : il tourne alors en mode démo
(catalogue avec des mobil-homes fictifs, formulaires qui écrivent dans le
`localStorage` du navigateur plutôt que Firestore). Dès que les variables
`NEXT_PUBLIC_FIREBASE_*` sont renseignées, l'application bascule automatiquement
sur les vraies données Firestore/Storage.

## Configuration Firebase

1. Copier `.env.example` en `.env.local` et renseigner les valeurs `NEXT_PUBLIC_FIREBASE_*`
   (Firebase Console → Project Settings → General → Your apps).
2. Déployer les règles de sécurité :
   - `firestore.rules` → Firestore Database → Rules
   - `storage.rules` → Storage → Rules
   (ou via `firebase deploy --only firestore:rules,storage:rules` si la CLI Firebase
   est installée et configurée)
3. Créer le premier compte administrateur :
   - Authentication → Users → **Add user** (email + mot de passe) → copier l'UID
   - Firestore → collection `users` → document dont l'ID = l'UID copié, avec les
     champs `email` (string), `name` (string), `role` = `"admin"` (string),
     `createdAt` (number)
4. Se connecter sur `/admin/login`.

Sans cette étape 3, la connexion Firebase Auth réussit mais aucune donnée
administrative n'est accessible (Security Rules : seuls les comptes ayant un
document dans `users/{uid}` sont considérés comme "staff").

## Architecture

```
src/
  app/
    [locale]/              # site public, routes /fr, /es, /pt
      mobilhomes/           # catalogue + fiche détail
      vendre-mon-mobilhome/ # formulaire de reprise
      contact/, a-propos/, mentions-legales/, politique-confidentialite/
    admin/                  # portail admin (non localisé), protégé par Firebase Auth
      (dashboard)/          # dashboard, mobilhomes, leads, reprises, settings
      login/
      mobilhomes/[id]/pdf/  # génération de la fiche PDF (route handler)
    sitemap.ts, robots.ts
  components/
    public/, mobilhomes/, forms/, admin/, ui/ (shadcn)
  lib/
    firebase/               # SDK client isomorphe, uploads, écritures publiques
    data/                   # accès aux données (public + admin), repli localStorage en mode démo
    i18n/                   # config locales + dictionnaires
    pdf/                    # document React-PDF
    validation/             # schémas Zod
    utils/
  translations/             # fr.json, es.json, pt.json
  types/
proxy.ts                    # routage i18n (remplace middleware.ts en Next 16)
firestore.rules / storage.rules / firebase.json
```

## Limites de coûts Firebase (volontaires)

- Maximum **15 photos** par mobil-home, **4 photos** par demande de reprise
  (appliqué côté formulaire et dans les Security Rules).
- Toute image est **compressée et redimensionnée côté navigateur** (WebP/JPEG,
  ~1920px, ~0.6 Mo cible) avant upload — jamais l'original.
- Taille de fichier plafonnée à 8 Mo côté Storage Rules (garde-fou en plus de la
  compression).
- Pas de listener Firestore temps réel : les données admin sont chargées à la
  demande (`getDocs`) et rafraîchies après chaque action.

## Vérifications avant déploiement

```bash
npm run lint
npm run build
```

## Déploiement

Le projet est prêt pour Vercel (`vercel deploy`). Penser à renseigner les
variables d'environnement du `.env.example` dans les paramètres du projet
Vercel, y compris `NEXT_PUBLIC_SITE_URL` (URL de production, utilisée pour le
sitemap, l'Open Graph et les QR codes des PDF).
