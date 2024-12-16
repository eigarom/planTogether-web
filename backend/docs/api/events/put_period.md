# Récupérer les informations

Modifie les informations d'une période pour un événement de la famille, pour un utilisateur authentifié, en utilisant les identifiants de l'événement et de la période.

**URL** : `/families/my-family/events/{id}/periods/{periodId}`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **id** (string, requis) : L'identifiant de l'événement à modifier.
-   **periodId** (string, requis) : L'identifiant de la période à modifier.

**Contraintes de données**

```json
{
		"startDateTime": "[format date/heure valide]",
		"endDateTime": "[format date/heure valide]",
		"alerts": [
				"[tableau de date/heure d'alertes facultatif]"
		]
}
```

**Exemple de données**

```json
{
		"startDateTime": "2024-11-25T22:00:00.000Z",
		"endDateTime": "2024-11-25T23:00:00.000Z",
		"alerts": [
				"2024-11-25T21:30:00.000Z"
		]
}
```

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
	"periodId": 22,
	"startDateTime": "2024-11-25T22:00:00.000Z",
	"endDateTime": "2024-11-25T23:00:00.000Z",
	"alerts": [
		{
			"id": 19,
			"dateTime": "2024-11-25T21:30:00.000Z"
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

### Si l'utilisateur tente de modifier les informations d'une période d'un événement qui n'est pas dans sa famille.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 403,
    "message": "Accès non autorisé aux données de cet événement"
}
```

### Si l'utilisateur tente de modifier les informations d'une période d'un événement privé ou pour lequel il ne participe pas.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 403,
    "message": "L'utilisateur ${userId} n'a pas les droits requis"
}
```

### Si la période à modifier est introuvable.

**Code** : `404 Not found`

**Contenu** :

```json
{
    "status": 404,
    "message":"Période introuvable"
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