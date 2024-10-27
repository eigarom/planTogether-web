# Récupérer l'image de profil

Fourni l'image de profil du membre correspondant à l'id.

**URL** : `/members/:id/image`

**Méthode** : `GET`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Contenu**

Image de profil du membre.

## Opération échouée
### Si l'id ne correspond pas à un membre de la famille de l'utilisateur authentifié.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
	"status":403,
	"message":"Accès non autorisé aux données de ce membre"
}
```

### Si le token utilisé contient l'id d'un utilisateur inexistant.

**Code** : `404 Not found`

**Contenu** :

```json
{
    "status":404,
    "message":"Image du membre introuvable"
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