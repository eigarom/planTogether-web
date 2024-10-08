# planTogether-web

**planTogether** est une application conçue pour simplifier la planification des activités familiales. Face aux emplois du temps souvent chargés des membres d'une famille, coordonner les horaires et les tâches devient un véritable défi. Cette application agit comme un assistant centralisé en regroupant toutes les informations relatives aux événements, aux listes de tâches et aux listes de courses. Elle optimise ainsi l'organisation quotidienne et facilite la communication entre les membres de la famille.

## Fonctionnalités principales

- **Gestion des événements** : Ajoutez et suivez les événements familiaux avec la possibilité d'attribuer une couleur distincte à chaque membre pour une visualisation plus claire.
- **Listes de tâches et de courses** : Créez, modifiez et gérez des listes partagées de tâches ou de courses accessibles à tous les membres de la famille, assurant une meilleure collaboration et un suivi simplifié.

## Installation

### Base de données

Depuis le répertoire `database` :

1. Exécutez le script SQL `01_create_database.sql` (par exemple dans pgAdmin) pour créer la base de données.
2. Choisissez un **nom d'utilisateur** et un **mot de passe** pour l'accès à cette nouvelle base de données.
3. Exécutez le script `02_create_user.sql` après avoir remplacé `{{DB_USER}}` par le nom d'utilisateur choisi et `{{DB_PASSWORD}}` par le mot de passe.
4. Exécutez le script `03_create_tables.sql` pour créer les tables nécessaires à l'application.
5. (Optionnel - pour les tests) Exécutez le script `04_insert_data.sql` pour insérer des données de test.
6. Exécutez le script `05_grant_backend_user.sql` après avoir remplacé `{{DB_USER}}` par le nom d'utilisateur choisi pour accorder les permissions nécessaires à l'utilisateur de la base de données.

### Back-end (Node.js Express)

1. Créez un fichier `.env` à la racine du répertoire `backend` et renseignez les variables suivantes :
    ```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=plantogether
    DB_USER={{DB_USER}}
    DB_PASSWORD={{DB_PASSWORD}}
    ```
   Remplacez `{{DB_USER}}` et `{{DB_PASSWORD}}` par les informations choisies lors de la configuration de la base de données.

2. Dans un terminal, placez-vous dans le répertoire `backend`.

3. Installez les dépendances avec la commande suivante :
    ```bash
    npm install
    ```
4. Lancez le serveur de développement :
    ```bash
    npm run dev
    ```

### Front-end (Vue.js)

1. Ouvrez un terminal dans le répertoire `frontend`.
2. Installez les dépendances :
    ```bash
    npm install
    ```
3. Lancez le serveur de développement :
    ```bash
    npm run dev
    ```

## Tests

Pour tester l'application avec un jeu de données préexistant (une famille et un utilisateur), assurez-vous d'avoir exécuté l'étape 5 de l'installation de la base de données.

Utilisez les identifiants suivants pour vous connecter à l'application :

- **Courriel** : diddy_kong@banana.com
- **Mot de passe** : 12345
