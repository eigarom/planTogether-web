# Rejoindre une famille

Rejoindre une famille à partir d'un code d'invitation.

**URL** : `/families/join`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

**Contraintes de données**

```json
{
    "inviteCode": "[code d'invitation valide]"
}
```

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
	"status":200,
	"token":"7147d5eef8e906c6834d68002cac1472"
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

### Si le code d'invitation n'est pas valide.

**Code** : `400 Unauthorized`

**Exemple de contenu** :

```json
{
    "status":400,
    "message":"Le code d'invitation ne peut pas être vide"
}
```

### Si le code d'invitation n'existe pas ou est expiré.

**Code** : `400 Unauthorized`

**Contenu** :

```json
{
    "status":400,
    "message":"Code d'invitation invalide ou expiré"
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