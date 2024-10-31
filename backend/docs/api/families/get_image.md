# Récupérer l'image de la famille

Fourni l'image de la famille de l'utilisateur authentifié.

**URL** : `/families/my_family/image`

**Méthode** : `GET`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Contenu**

Image de profil de la famille de l'utilisateur.

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

### Si le token utilisé contient l'id d'une famille inexistante.

**Code** : `404 Not found`

**Contenu** :

```json
{
    "status":404,
    "message":"Image de la famille introuvable"
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