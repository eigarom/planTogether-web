# Récupérer un membre spécifique de la famille

Permet de récupérer les informations d'un membre spécifique de la famille en utilisant son identifiant.

**URL** : `/families/my-family/members/{id}`

**Méthode** : `GET`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **id** (string, requis) : L'identifiant du membre à récupérer.

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu** :

```json
{
    "id": "1",
    "name": "Tremblay",
    "color": "#FF0000"
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

### Si le membre spécifié n'est pas trouvé.

**Code** : `404 Not Found`

**Contenu** :

```json
{
    "status": 404,
    "message": "Membre introuvable"
}
```

### Si une erreur survient lors de la récupération du membre.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```
