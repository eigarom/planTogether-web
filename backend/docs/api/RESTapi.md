# Documentation API

## Routes ouvertes

Ne requiert pas d'authentication.

* [Vérification du statut du serveur](health/health.md): `GET /health`
* [Connexion](auth/login.md) : `POST /auth/login`
* [Inscription](auth/register.md) : `POST /auth/register`

## Routes nécessitant l'authentication

Ces routes nécéssitent un token valide à inclure dans le header de la requête.
Un token peut être obtenu depuis la route de [connexion](auth/login.md).

### Utilisateur

Chaque route manipule ou fournit de l'information associée à l'utilisateur correspondant au token fournit dans la
requête.

* [Récupération des informations](users/get.md) : `GET /users/me`
* [Récupération de l'image de profil](users/get_image.md) : `GET /users/me/image`

### Famille

Chaque route manipule ou fournit de l'information associée à la famille correspondant au token fournit 
dans la
requête.

* [Récupération des informations](families/get.md) : `GET /families/my-family`
* [Récupération de l'image de profil](families/get_image.md) : `GET /families/my-family/image`