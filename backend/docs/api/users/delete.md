# Supprimer l'utilisateur

Supprime les informations de l'utilisateur.

**URL** : `/users/me`

**Méthode** : `DELETE`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Contenu**

```json
{}
```

## Opération échouée
### Si le token fourni est incorrect.

**Code** : `401 Unauthorized`

**Contenu** :

```json
{
    "status":401,
    "message":"Erreur lors de la récupération du token"
}
```

### Si le token utilisé contient l'id d'un utilisateur inexistant.

**Code** : `404 Not found`

**Contenu** :

```json
{
    "status":404,
    "message":"Utilisateur introuvable"
}
```

### Si une erreur survient côté serveur.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status":500,
    "message":"[Message d'erreur correspondant]"
}
```