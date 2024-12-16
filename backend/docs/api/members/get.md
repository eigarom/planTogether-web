# Récupérer les membres de la famille

Permet de récupérer la liste des membres de la famille de l'utilisateur authentifié.

**URL** : `/members`

**Méthode** : `GET`

**Authentification requise** : Oui

**Permissions requises** : Aucune

## Opération réussie

**Code** : `200 OK`

**Contenu** :

```json
{
    "accountMembers": [
        {
            "id": "1",
            "name": "John",
            "color": "#FF0000"
        }
    ],
    "guestMembers": [
        {
            "id": "2",
            "name": "Jeanne",
            "color": "#FF0000"
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

### Si les membres de la famille ne sont pas trouvés.

**Code** : `404 Not Found`

**Contenu** :

```json
{
    "status": 404,
    "message": "Membres de la famille introuvables"
}
```

### Si une erreur survient lors de la récupération des membres de la famille.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status": 500,
    "message": "[Message d'erreur correspondant]"
}
```
