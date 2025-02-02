# ImmoGestion

Application de gestion immobilière développée avec React.

## Configuration requise

- Node.js 16+
- npm ou yarn

## Installation

1. Clonez le repository :
bash
git clone https://github.com/votre-username/immogestion.git
cd immogestion


2. Installez les dépendances :
bash
npm install
# ou
yarn install


3. Créez un fichier `.env` à partir du fichier `.env.example` :
bash
cp .env.example .env


4. Configurez vos variables d'environnement dans le fichier `.env`

5. Démarrez l'application :
bash
npm start
# ou
yarn start


## Déploiement

### Vercel

1. Créez un compte sur [Vercel](https://vercel.com)
2. Installez Vercel CLI :
bash
npm i -g vercel


3. Connectez-vous à Vercel :
bash
vercel login


4. Déployez :
bash
vercel


### Variables d'environnement requises

- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_CLOUDINARY_CLOUD_NAME`
- `REACT_APP_CLOUDINARY_API_KEY`
- `REACT_APP_CLOUDINARY_API_SECRET`

## Structure du projet


immogestion/
├── components/
│   ├── auth/
│   ├── common/
│   ├── dashboard/
│   ├── documents/
│   ├── finances/
│   ├── layout/
│   ├── properties/
│   ├── settings/
│   ├── taxes/
│   └── tenants/
├── styles/
├── utils/
├── index.html
└── app.js


## Licence

MIT
