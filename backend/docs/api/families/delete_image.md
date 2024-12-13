# Supprimer l'image de la famille

Permet de supprimer l'image de la famille de l'utilisateur authentifié.

**URL** : `/families/my-family/image`

**Méthode** : `DELETE`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Contenu** :

```json
{}
```

## Opération échouée

### Si la famille n'est pas trouvée.

**Code** : `404 Not Found`

**Contenu** :

```json
{
    "status": 404,
    "message": "Famille introuvable"
}
```

### Si une erreur survient lors de la suppression de l'image.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "Erreur lors de la suppression de l'image"
}
```
