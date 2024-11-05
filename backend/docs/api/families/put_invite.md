# Création d'un code d'invitation

Créer un code d'invitation avec une date de validité à partager à un autre utilisateur.

**URL** : `/families/my-family/invite`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
	"status":200,
	"inviteCode":"7147d5eef8e906c6834d68002cac1472"
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

### Si une erreur survient côté serveur.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status":500,
    "message":"[Message d'erreur correspondant]"
}
```