# planTogether-web

**planTogether** est une application conçue pour faciliter la planification des activités familiales. Dans un contexte
où les emplois du temps sont souvent chargés, il devient difficile de coordonner les horaires et les tâches de chacun.
L'application agit comme un assistant centralisé, permettant de regrouper en un seul lieu toutes les informations sur
les événements, les listes de tâches et les listes de courses des membres de la famille. Cela optimise ainsi
l'organisation et la gestion quotidienne, tout en améliorant la communication entre les membres.

## Fonctionnalités principales

- **Gestion d'événements** : Ajoutez et suivez les événements familiaux avec la possibilité d'attribuer des couleurs
  distinctes pour chaque membre.
- **Listes de tâches et de courses** : Créez, modifiez et gérez des listes de tâches ou de courses partagées par tous
  les membres de la famille.
- **Suivi simplifié** : Retrouvez toutes les informations en un coup d'œil et accédez facilement aux événements, tâches
  et courses à venir.

## Installation

### Base de données

Depuis le répertoire `database` :

1. Copier et exécuter le contenu du fichier `01_create_database.sql` dans pgadmin par exemple.

2. Choisir un **nom d'utilisateur** et un **mot de passe** pour l'accès à la base de donnée nouvellement créée.

3. Copier et exécuter le contenu de `02_create_user.sql` après avoir remplacé `{{DB_USER}}` par le nom d'utilisateur
   et `{{DB_PASSWORD}}` par le mot de passe choisi.

4. Copier et exécuter le contenu du fichier `03_create_tables.sql`.

5. Copier et exécuter le contenu du fichier `04_insert_data.sql`.

6. Copier et exécuter le contenu de `05_grant_backend_user.sql` après avoir remplacé `{{DB_USER}}` par le nom
   d'utilisateur
   choisi.

### Back-end (Node.js Express)

1. Créez un fichier `.env` à la racine du répertoire `backend` et renseignez les variables suivantes.
   Remplacer `{{DB_USER}}` et `{{DB_PASSWORD}}` par le nom d'utilisateur et le mot de passe choisis pour la base de données.
    ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=plantogether
   DB_USER={{DB_USER}}
   DB_PASSWORD={{DB_PASSWORD}}
    ```

2. Ouvrez un terminal dans le répertoire `backend`.

3. Installez les dépendances :
   ```
   npm install
   ```
4. Lancez le serveur de développement :
   ```
   npm run dev
   ```

### Front-end (Vue.js)

1. Ouvrez un terminal dans le répertoire `frontend`.
2. Installez les dépendances :
   ```
   npm install
   ```
3. Lancez le serveur de développement :
   ```
   npm run dev
   ```