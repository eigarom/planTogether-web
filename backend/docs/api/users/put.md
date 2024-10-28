# Modifier les informations

Modifie les informations de l'utilisateur authentifié.

**URL** : `/users/me`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
    "id": 1,
    "email": "johndoe@exemple.com",
	"name": "John Doe",
	"color": "#FF0000",
	"lang": "fr",
	"theme": "dark"
}
```

## Opération échouée
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