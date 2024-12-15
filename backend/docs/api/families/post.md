# Créer une famille

Permet de créer une nouvelle famille pour l'utilisateur authentifié.

**URL** : `/families`

**Méthode** : `POST`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **id** (string, requis) : L'identifiant du user dont les informations doivent être mises à jour.

**Contraintes de données**

```json
{
    "name": "[nom valide]",
    "color": "[couleur valide]"
}
```

**Exemple de données**

```json
{
    "name": "John Doe",
    "color": "#FF0000"
}
```

## Opération réussie

**Code** : `201 Created`

**Contenu** :

```json
{
    "family": {
        "name": "Nom de la famille",
        "color": "Couleur de la famille"
    },
    "token": "Nouveau token d'authentification"
}
```

## Opération échouée

### Si le token fourni est incorrect.

**Code** : `401 Unauthorized`

**Contenu** :

```json
{
    "status": 401,
    "message": "Erreur lors de la récupération du token"
}
```

### Si le corps de la requête est invalide (validation échouée).

**Code** : `400 Bad Request`

**Contenu** :

```json
{
    "status": 400,
    "message": "Erreur de validation des données"
}
```

## Si une erreur survient lors de la création de la famille ou de la récupération des informations utilisateur.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```
