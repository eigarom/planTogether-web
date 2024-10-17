# Connexion

Récupère un token pour un utilisateur enregistré.

**URL** : `/api/login/`

**Méthode** : `POST`

**Authentification requise** : Non

**Permissions requises** : Aucune

**Contraintes de données**

```json
{
    "username": "[courriel valide]",
    "password": "[mot de passe correspondant]"
}
```

**Exemple de données**

```json
{
    "username": "email@example.com",
    "password": "Motdepasse12345$"
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

### Si la combinaison 'username' et 'password' est mauvaise.

**Code** : `401 Unauthorized`

**Contenu** :

```json
{
    "status":401,
    "message":"Identifiants invalides"
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
