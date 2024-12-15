# Supprimer une famille

Permet de supprimer la famille de l'utilisateur authentifié.

**URL** : `/families/my-family`

**Méthode** : `DELETE`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Contenu** :

```json
{
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

### Si la famille n'est pas trouvée.

**Code** : `404 Not Found`

**Contenu** :

```json
{
    "status": 404,
    "message": "Famille introuvable"
}
```

### Si une erreur survient lors de la suppression de la famille ou de la récupération des informations utilisateur.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```
