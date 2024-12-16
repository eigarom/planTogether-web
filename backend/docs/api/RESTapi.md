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

Chaque route manipule ou fournit de l'information associée à l'utilisateur correspondant au token fourni dans la
requête.

* [Récupération des informations](users/get.md) : `GET /users/me`
* [Modification des informations](users/put.md) : `PUT /users/me`
* [Suppression de l'utilisateur](users/delete.md) : `DELETE /users/me`

### Famille

Chaque route manipule ou fournit de l'information associée à la famille correspondant au token fourni 
dans la
requête.

* [Récupération des informations](families/get.md) : `GET /families/my-family`
* [Récupération de l'image de profil](families/get_image.md) : `GET /families/my-family/image`
* [Création d'un code d'invitation](families/put_invite.md) : `GET /families/my-family/invite`
* [Rejoindre une famille](families/put_join.md) : `GET /families/my-family/join`

### Membre

Chaque route manipule ou fournit de l'information associée à un membre de la famille de l'utilisateur correspondant au 
token fourni dans la requête.

* [Récupération de l'image de profil](members/get_image.md) : `GET /families/my-family/members/:id/image`
* [Modification de l'image de profil](members/put_image.md) : `PUT /families/my-family/members/:id/image`
* [Suppression de l'image de profil](members/delete_image.md) : `DELETE /families/my-family/members/:id/image`

### Événement

Chaque route manipule ou fournit de l'information associée aux événements de la famille de l'utilisateur correspondant au token fourni dans la requête.

* [Récupération des informations de tous les événements](events/get.md) : `GET /families/my-family/events`
* [Récupération des informations d'une période et d'un événement](events/get_id.md) : `GET /families/my-family/events/{id}/periods/{periodId}`
* [Récupération des informations du nombre de périodes pour un événement](events/get_number_periods.md) : `GET /families/my-family/events/{id}/periods`
* [Création d'un événement](events/post.md) `POST /families/my-family/events`
* [Modification d'un événement](events/put_event.md) `PUT /families/my-family/events/{id}`
* [Modification d'une période d'un événement](events/put_period.md) `PUT /families/my-family/events/{id}/periods/{periodId}`
* [Suppression d'un événement](events/delete_event.md) `DELETE /families/my-family/events/{id}`
* [Suppression d'une période d'un événement](events/delete_period.md) `DELETE /families/my-family/events/{id}/periods/{periodId}`