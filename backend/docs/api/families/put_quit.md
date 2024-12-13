# Quitter la famille

Permet à l'utilisateur authentifié de quitter sa famille.

**URL** : `/families/my-family/quit`

**Méthode** : `PUT`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Contenu** :

```json
{
    "token": "Nouveau token d'authentification"
}
```

## Opération échouée

### Si une erreur survient lors du processus de quitter la famille (par exemple, problème de suppression des liens ou de mise à jour des informations).

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```
