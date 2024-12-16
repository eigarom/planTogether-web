# Récupérer les informations

Supprime une période pour un événement de la famille, pour un utilisateur authentifié, en utilisant les identifiants de l'événement et de la période.

**URL** : `/families/my-family/events/{id}/periods/{periodId}`

**Méthode** : `DELETE`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **id** (string, requis) : L'identifiant de l'événement à supprimer.
-   **periodId** (string, requis) : L'identifiant de la période à supprimer.

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{}
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

### Si l'utilisateur tente de supprimer une période d'un événement qui n'est pas dans sa famille.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 403,
    "message": "Accès non autorisé aux données de cet événement"
}
```

### Si l'utilisateur tente de supprimer une période d'un événement privé ou pour lequel il ne participe pas.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 403,
    "message": "L'utilisateur ${userId} n'a pas les droits requis"
}
```

### Si la période à supprimer est introuvable.

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