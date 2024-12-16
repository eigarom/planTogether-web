# Récupérer les informations

Ajoute un nouvel événement à la famille, pour un utilisateur authentifié.

**URL** : `/families/my-family/events`

**Méthode** : `POST`

**Authentification requise** : Oui

**Permissions requises** : Aucune

**Contraintes de données**

```json
{
		"name": "[nom valide]",
		"description": "[description facultative, mais doit être valide si présente]",
		"isVisible": "[booléen]",
		"periods": ["[tableau de périodes valides, contenant un objet période au minimum]"
			{
				"startDateTime": "[format date/heure valide]",
				"endDateTime": "[format date/heure valide]",
				"alerts": [
						"[tableau de date/heure d'alertes facultatif]"
				]
			}
		],
		"members": "[tableau de id de membres valides, contenant un id de membre au minimum]"
}
```

**Exemple de données**

```json
{
		"name": "Yoga",
		"description": "Séances de yoga entre filles",
		"isVisible": true,
		"periods": [
			{
				"startDateTime": "2024-11-12T22:00:00.000Z",
				"endDateTime": "2024-11-12T23:00:00.000Z",
				"alerts": [
						"2024-11-12T21:30:00.000Z"
				]
			},
			{
				"startDateTime": "2024-11-19T22:00:00.000Z",
				"endDateTime": "2024-11-19T23:00:00.000Z",
				"alerts": [
						"2024-11-19T21:30:00.000Z"
				]
			},
			{
				"startDateTime": "2024-11-26T22:00:00.000Z",
				"endDateTime": "2024-11-26T23:00:00.000Z",
				"alerts": [
				"2024-11-26T21:30:00.000Z"
				]
			}
		],
		"members": [
			1, 3
		]
}
```

## Opération réussie

**Code** : `201 Created`

**Exemple de contenu**

```json
{
	"id": 11,
	"name": "Yoga",
	"description": "Séances de yoga entre filles",
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
			"startDateTime": "2024-11-26T22:00:00.000Z",
			"endDateTime": "2024-11-26T23:00:00.000Z",
			"alerts": [
				{
					"id": 18,
					"dateTime": "2024-11-26T21:30:00.000Z"
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

### Si une erreur survient côté serveur.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message":"[Message d'erreur correspondant]"
}
```