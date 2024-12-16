# Récupérer les informations

Fournit les informations d'une période et d'un événement de la famille, pour un utilisateur authentifié, en utilisant les identifiants de l'événement et de la période.

**URL** : `/families/my-family/events/{id}/periods/{periodId}`

**Méthode** : `GET`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **id** (string, requis) : L'identifiant de l'événement à récupérer.
-   **periodId** (string, requis) : L'identifiant de la période à récupérer.

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
	"id": 2,
	"name": "Garage",
	"description": "Changement de pneus",
	"isVisible": true,
	"period": {
		"id": 2,
		"startDateTime": "2024-11-05T13:30:00.000Z",
		"endDateTime": "2024-11-05T15:00:00.000Z",
		"alerts": [
			{
				"id": 1,
				"dateTime": "2024-11-05T12:30:00.000Z"
			}
		]
	},
	"members": [
		{
			"id": 2,
			"name": "Diddy",
			"color": "#E60514"
		}
	]
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

### Si l'utilisateur tente d'accéder aux informations d'un événement qui n'est pas dans sa famille.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 403,
    "message": "Accès non autorisé aux données de cet événement"
}
```

### Si l'utilisateur tente d'accéder aux informations d'un événement privé ou pour lequel il ne participe pas.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 403,
    "message": "L'utilisateur ${userId} n'a pas les droits requis"
}
```

### Si une erreur survient côté serveur.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message":"[Message d'erreur correspondant]"
}
```