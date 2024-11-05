# Récupérer les informations

Fournit les informations sur les événements de la famille, pour un utilisateur authentifié.

**URL** : `/families/my-family/events`

**Méthode** : `GET`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
[
	{
		"id": 1,
		"name": "Concert",
		"description": "Aller au concert du soir.",
		"isVisible": true,
		"periods": [
			{
				"id": 1,
				"startDateTime": "2024-11-16T20:00:00.000Z",
				"endDateTime": "2024-11-16T22:00:00.000Z"
			}
		],
		"alerts": [],
		"members": [
			{
				"id": 1,
				"name": "Dixie",
				"color": "#E677C6"
			},
			{
				"id": 2,
				"name": "Diddy",
				"color": "#E60514"
			}
		]
	},
	{
		"id": 2,
		"name": "Garage",
		"description": "Changement de pneus",
		"isVisible": true,
		"periods": [
			{
				"id": 2,
				"startDateTime": "2024-11-05T08:30:00.000Z",
				"endDateTime": "2024-11-05T10:00:00.000Z"
			}
		],
		"alerts": [
			{
				"id": 1,
				"dateTime": "2024-11-05T07:30:00.000Z"
			}
		],
		"members": [
			{
				"id": 2,
				"name": "Diddy",
				"color": "#E60514"
			}
		]
	},
	{
		"id": 3,
		"name": "Biblio",
		"description": "Aller porter mes 2 livres",
		"isVisible": true,
		"periods": [
			{
				"id": 3,
				"startDateTime": "2024-11-05T17:00:00.000Z",
				"endDateTime": "2024-11-05T17:15:00.000Z"
			}
		],
		"alerts": [],
		"members": [
			{
				"id": 2,
				"name": "Diddy",
				"color": "#E60514"
			}
		]
	}
]
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