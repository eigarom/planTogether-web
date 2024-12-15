# Supprimer un membre non inscrit

Permet de supprimer un membre non inscrit de la famille en utilisant son identifiant.

**URL** : `/members/:id`

**Méthode** : `DELETE`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **id** (string, requis) : L'identifiant du membre à supprimer.

## Opération réussie

**Code** : `200 OK`

**Contenu** :

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

### Si l'id ne correspond pas à un membre de la famille de l'utilisateur authentifié.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 403,
    "message": "Accès non autorisé aux données de ce membre"
}
```

### Si le membre spécifié n'est pas trouvé.

**Code** : `404 Not Found`

**Contenu** :

```json
{
    "status": 404,
    "message": "Membre introuvable"
}
```

### Si une erreur survient lors de la suppression du membre.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```