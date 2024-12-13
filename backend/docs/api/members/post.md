# Ajouter un membre à la famille

Permet d'ajouter un nouveau membre à la famille de l'utilisateur authentifié.

**URL** : `/families/my-family/members`

**Méthode** : `POST`

**Authentification requise** : Oui

**Permissions requises** : Aucune (mais l'utilisateur doit être membre de la famille)

## Paramètres de la requête

-   **name** (string, requis) : Le nom du nouveau membre.
-   **color** (string, requis) : La couleur associée au membre.

## Opération réussie

**Code** : `201 Created`

**Contenu** :

```json
{
    "id": "ID du membre",
    "name": "Nom du membre",
    "color": "Couleur du membre"
}
```

## Opération échouée

### Si l'utilisateur n'est pas trouvé dans la famille.

**Code** : `404 Not Found`

**Contenu** :

```json
{
    "status": 404,
    "message": "Utilisateur ou famille introuvable"
}
```

### Si une erreur survient lors de l'ajout du membre.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```
