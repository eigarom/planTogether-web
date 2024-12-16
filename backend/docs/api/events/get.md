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
				"startDateTime": "2024-11-17T01:00:00.000Z",
				"endDateTime": "2024-11-17T03:00:00.000Z",
				"alerts": []
			}
		],
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
				"startDateTime": "2024-11-05T13:30:00.000Z",
				"endDateTime": "2024-11-05T15:00:00.000Z",
				"alerts": [
					{
						"id": 1,
						"dateTime": "2024-11-05T12:30:00.000Z"
					}
				]
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
				"startDateTime": "2024-11-05T22:00:00.000Z",
				"endDateTime": "2024-11-05T22:15:00.000Z",
				"alerts": []
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
		"id": 4,
		"name": "Cadeau pour Dixie",
		"description": "Acheter le cadeau pour Dixie.",
		"isVisible": false,
		"periods": [
			{
				"id": 4,
				"startDateTime": "2024-10-23T22:00:00.000Z",
				"endDateTime": "2024-10-23T22:15:00.000Z",
				"alerts": []
			}
		],
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

### Si le token fourni est incorrect.

**Code** : `401 Unauthorized`

**Contenu** :

```json
{
    "status": 401,
    "message": "Erreur lors de la récupération du token"
}
```

### Si aucun événement n'est trouvé pour cet id de famille.

**Code** : `404 Not found`

**Contenu** :

```json
{
    "status": 404,
    "message":"Événements pour la famille ${familyId} introuvables"
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