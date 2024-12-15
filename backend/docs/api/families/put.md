# Mettre à jour les informations de la famille

Permet de mettre à jour les informations de la famille de l'utilisateur authentifié.

**URL** : `/families/my-family`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **name** (string, requis) : Le nouveau nom de la famille.
-   **color** (string, requis) : La nouvelle couleur associée à la famille.

## Opération réussie

**Code** : `200 OK`

**Contenu** :

```json
{
    "id": "ID de la famille",
    "name": "Nom de la famille",
    "color": "Couleur de la famille"
}
```

## Opération échouée

### Si le corps de la requête est invalide (validation échouée).

**Code** : `400 Bad Request`

**Contenu** :

```json
{
    "status": 400,
    "message": "Erreur de validation des données"
}
```

### Si le token fourni est incorrect.

**Code** : `401 Unauthorized`

**Contenu** :

```json
{
    "status": 401,
    "message": "Erreur lors de la récupération du token"
}
```

### Si une erreur survient lors de la mise à jour des informations de la famille.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```
