# Mettre à jour l'image de la famille

Permet de mettre à jour l'image de la famille de l'utilisateur authentifié.

**URL** : `/families/my-family/image`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Paramètres de la requête

-   **family-image** (fichier, requis) : L'image à télécharger

## Opération réussie

**Code** : `200 OK`

**Contenu** :

L'image de la famille mise à jour, envoyée en réponse dans le format approprié.

## Opération échouée

### Si le fichier téléchargé ne correspond pas aux critères de validation (format incorrect).

**Code** : `400 Bad Request`

**Contenu** :

```json
{
    "status": 400,
    "message": "Erreur de validation de l'image"
}
```

### Si l'identifiant de la famille ne correspond à aucune famille existante.

**Code** : `404 Not Found`

**Contenu** :

```json
{
    "status": 404,
    "message": "L'id [ID de la famille] ne correspond à aucune famille existante"
}
```

### Si une erreur survient lors de la mise à jour de l'image de la famille.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```
