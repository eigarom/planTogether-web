# Inscription

Inscrit un nouvel utilisateur et récupère un token d'authentification.

**URL** : `/api/register/`

**Méthode** : `POST`

**Authentification requise** : Non

**Permissions requises** : Aucune

**Contraintes de données**

```json
{
    "username": "[courriel valide]",
    "password": "[mot de passe valide]",
    "name": "[nom valide]"
}
```

**Exemple de données**

```json
{
    "username": "email@example.com",
    "password": "Motdepasse12345$",
    "name": "John"
}
```

## Opération réussie

**Code** : `200 OK`

**Exemple de contenu**

```json
{
    "token": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d"
}
```

## Opération échouée

### Si le courriel n'est pas valide.

**Code** : `400 Unauthorized`

**Contenu** :

```json
{
    "status":400,
    "message":"\"email\" must be a valid email"
}
```

### Si le mot de passe n'est pas valide.

**Code** : `400 Unauthorized`

**Contenu** :

```json
{
    "status":400,
    "message":"Le mot de passe doit contenir au moins 16 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
}
```

### Si le nom n'est pas valide.

**Code** : `400 Unauthorized`

**Contenu** :

```json
{
    "status":400,
    "message":"Le nom n'est pas valide"
}
```

### Si le courriel n'est pas disponible.

**Code** : `401 Unauthorized`

**Contenu** :

```json
{
    "status":401,
    "message":"Courriel non disponible"
}
```

### Si une erreur survient côté serveur.

**Code** : `500 Internal Server Error`

**Contenu** :

```json
{
    "status":500,
    "message":"[Message d'erreur correspondant]"
}
```
