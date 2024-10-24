# Récupérer les informations

Fourni les informations de la famille de l'utilisateur authentifié.

**URL** : `/families/my-family`

**Méthode** : `GET`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
    "name": "Famille Bleau",
	"color": "#FF0000"
}
```

## Opération échouée
### Si le token utilisé contient l'id d'une famille inexistante.

**Code** : `404 Not found`

**Contenu** :

```json
{
    "status":404,
    "message":"Famille introuvable"
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