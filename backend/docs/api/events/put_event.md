# Récupérer les informations

Modifie un événement de la famille, pour un utilisateur authentifié, en utilisant l'identifiant de l'événement.

**URL** : `/families/my-family/events/{id}`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **id** (string, requis) : L'identifiant de l'événement à modifier.

**Contraintes de données**

```json
{
		"name": "[nom valide]",
		"description": "[description facultative, mais doit être valide si présente]",
		"isVisible": "[booléen]",
		"members": "[tableau de id de membres valides, contenant un id de membre au minimum]"
}
```

**Exemple de données**

```json
{
		"name": "Yoga tous ensemble",
		"description": "Séances de yoga tous ensemble",
		"isVisible": true,
		"members": [
			1, 3, 2
		]
}
```

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
	"id": 11,
	"name": "Yoga tous ensemble",
	"description": "Séances de yoga tous ensemble",
	"isVisible": true,
	"periods": [
		{
			"id": 20,
			"startDateTime": "2024-11-12T22:00:00.000Z",
			"endDateTime": "2024-11-12T23:00:00.000Z",
			"alerts": [
				{
					"id": 16,
					"dateTime": "2024-11-12T21:30:00.000Z"
				}
			]
		},
		{
			"id": 21,
			"startDateTime": "2024-11-19T22:00:00.000Z",
			"endDateTime": "2024-11-19T23:00:00.000Z",
			"alerts": [
				{
					"id": 17,
					"dateTime": "2024-11-19T21:30:00.000Z"
				}
			]
		},
		{
			"id": 22,
			"startDateTime": "2024-11-25T22:00:00.000Z",
			"endDateTime": "2024-11-25T23:00:00.000Z",
			"alerts": [
				{
					"id": 19,
					"dateTime": "2024-11-25T21:30:00.000Z"
				}
			]
		}
	],
	"members": [
		{
			"id": 1,
			"name": "Dixie",
			"color": "#E677C6"
		},
		{
			"id": 3,
			"name": "Candy",
			"color": "#eab4f0"
		},
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

### Si les validations ont échoué.

**Code** : `400 Bad Request`

**Contenu** :

```json
{
    "status": 400,
    "message": "[Message d'erreur de validation des données correspondant]"
}
```

### Si l'utilisateur tente de modifier les informations d'un événement qui n'est pas dans sa famille.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 403,
    "message": "Accès non autorisé aux données de cet événement"
}
```

### Si l'utilisateur tente de modifier les informations d'un événement privé ou pour lequel il ne participe pas.

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