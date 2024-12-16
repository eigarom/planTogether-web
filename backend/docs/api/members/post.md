# Ajouter un membre non inscrit à la famille

Permet d'ajouter un nouveau membre non inscrit à la famille de l'utilisateur authentifié.

**URL** : `/members`

**Méthode** : `POST`

**Authentification requise** : Oui

**Permissions requises** : Aucune

**Contraintes de données**

```json
{
    "name": "[nom valide]",
    "color": "[couleur valide]"
}
```

**Exemple de données**

```json
{
    "name": "John Doe",
    "color": "#FF0000"
}
```

## Opération réussie

**Code** : `201 Created`

**Exemple de contenu** :

```json
{
    "id": "ID du membre",
    "name": "Nom du membre",
    "color": "Couleur du membre"
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
