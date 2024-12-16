# Récupérer les informations

Fournit le nombre de périodes pour un événement de la famille, pour un utilisateur authentifié.

**URL** : `/families/my-family/events/{id}/periods`

**Méthode** : `GET`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **id** (string, requis) : L'identifiant de l'événement à récupérer.

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
	"numberOfPeriods": "2"
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

### Si l'événement ne contient pas de périodes.

**Code** : `404 Not found`

**Contenu** :

```json
{
    "status": 404,
    "message":"L'événement ${eventId} ne contient pas de périodes"
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