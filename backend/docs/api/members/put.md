# Mettre à jour les informations d'un membre

Permet de mettre à jour les informations (nom et couleur) d'un membre de la famille de l'utilisateur.

**URL** : `/members/:id`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **id** (string, requis) : L'identifiant du membre dont les informations doivent être mises à jour.
-   **name** (string, requis) : Le nouveau nom du membre.
-   **color** (string, requis) : La nouvelle couleur associée au membre.

## Opération réussie

**Code** : `200 OK`

**Contenu** :

```json
{
    "id": "ID du membre",
    "name": "Nom mis à jour",
    "color": "Couleur mise à jour"
}
```

## Opération échouée

### Si les données envoyées ne sont pas valides.

**Code** : `400 Bad Request`

**Contenu** :

```json
{
    "status": 400,
    "message": "Erreur de validation des données"
}
```

### Si le token fourni est incorrect.

**Code** : `401 Unauthorized`

**Contenu** :

```json
{
    "status": 401,
    "message": "Erreur lors de la récupération du token"
}
```

### Si l'utilisateur tente de modifier les informations d'un membre qui n'est pas dans sa famille.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 403,
    "message": "Accès non autorisé aux données de ce membre"
}
```

### Si une erreur survient lors de la mise à jour des informations du membre.

**Code** : `403 Forbidden`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```