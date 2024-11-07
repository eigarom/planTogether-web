# Modifier les informations

Modifie les informations de l'utilisateur authentifié.

**URL** : `/users/me`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

**Contraintes de données**

```json
{
    "username": "[courriel valide]",
    "name": "[nom valide]",
    "color": "[couleur valide]"
}
```

**Exemple de données**

```json
{
	"email": "johndoe@exemple.com",
	"name": "John Doe",
	"color": "#FF0000"
}
```

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
    "id": 1,
    "email": "johndoe@exemple.com",
	"name": "John Doe",
	"color": "#FF0000"
}
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