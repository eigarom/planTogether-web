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
            "id": "accountMember.id_member",
            "name": "accountMember.name",
            "color": "accountMember.color"
        }
    ],
    "guestMembers": [
        {
            "id": "guestMember.id_member",
            "name": "guestMember.name",
            "color": "guestMember.color"
        }
    ]
}
```

## Opération échouée

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
