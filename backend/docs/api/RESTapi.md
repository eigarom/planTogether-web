# Documentation API

## Routes ouvertes

Ne requiert pas d'authentication.

* [Vérification du statut du serveur](health/health.md): `GET /health`
* [Connexion](auth/login.md) : `POST /api/login`

## Routes nécessitant l'authentication

Ces routes nécéssitent un token valide à inclure dans le header de la requête.
Un token peut être obtenu depuis la route de [connexion](auth/login.md).

### Utilisateur

Chaque route manipule ou fournit de l'information associée à l'utilisateur correspondant au token fournit dans la
requête.

* [Récupération des informations](users/get.md) : `GET /api/users/me`