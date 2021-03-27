# Projet Groupomania

date de début: 01/03/2021

## Projet 7 du parcours développeur web d'Openclassrooms

### Objectif: Créez un réseau social d'entreprise

Créer la MVP d'une application web complète ayant les fonctionnalités d"un réseau social d'entreprise, interne et ludique pour l'entreprise de grande distribution Groupomania. L'application web permet aux utilisateurs d'ajouter des gags avec une image et une description, de les commenter et de les liker ou disliker.
Les exigences sont :

- la présentation des fonctionnalités doit être simple
- la création d’un compte doit être simple et possible depuis un téléphone mobile
- le profil doit contenir très peu d’informations pour que sa complétion soit rapide
- la suppression du compte doit être possible
- l’accès à un forum où les salariés publient des contenus multimédias doit être présent
- le ou la chargé-e de communication Groupomania doit pouvoir modérer les interactions entre salariés

La web app est composé de deux parties : une API backend et une partie frontend.

L'API doit pouvoir communiquer avec la partie front-end disponible ici : https://github.com/OpenClassrooms-Student-Center/dwj-projet6
qui peut être clonée et installée en local avec node.js et npm. (pour installer cette partie utiliser les commandes `npm install` puis `npm install node-sass` et lancer l'application avec la commande `ng server` et ouvrir Http://localhost/4200 sur la navigateur)

![Screenshot](readme/groupomania.png)

### Fonctionnement du Backend:

Cet API fonctionne sur le principe d'une **APIrest** et met en place une logique **CRUD**, (Create, Read, Update, Delete) en fonction des autorisations.

L'API est codée en _Javascript_, elle est réalisée en utilisant un _server NodeJS_ et le _framework Express_ pour la création de l'application. Elle utilise une base de données relationnelles locale _mySQL_ qui est gérée via l'ORM _Sequelize_.

L'API utilise des pratiques de **code sécurisé** en ayant recours aux:

- Chiffrement des mots de passe dans la base de données avec l'algorithme _bcrypt_ et hashage des adresses email
- Principe de pseudonymisation: un id est attribué à chaque utilisateur et seuls l'adresse email et le pseudo des utilisateurs est connue (aucun nom, adresse, date de naissance... sont stockés dans la base de donnée)
- Authentification par jeton requise pour toute action, les jetons sont générés par la technologie _JsonWebToken_

### Fonctionnement du Frontend:

Le frontend permet à l'utilisateur de se connecter et de se déconnecter à l'application. Il utilise le concept d'application monopage. L'app est codée en _Javascript_ et utilise le framework _VUE.JS_. Les pages respectent les standards WCAG.

### Utilisation:

**Prérequis:** NodeJS, NPM et mySQL doivent être déjà installé.

1. Cloner le répertoire complet
2. Dans le répertoire **backend**: 2. 1. Installer l'API avec la commande `npm install` 2. 2. Ouvrir une session MySQL root et importer le fichier config/config.sql ou copier-coller les instructions mySQL contenu dans ce fichier  
   2. 3. Lancer l'API avec la commande `node server` ou `npm start` (l'API se lance à l'addresse: Http://localhost/3000)
3. Dans le répertoire **frontend**: 3. 1. Installer la web app avec la commande `npm install` 3. 2. Lancer l'app avec la commande `npm run serve` (l'app se lance à l'addresse: Http://localhost/8080)
4. Rendez-vous sur Http://localhost/4200 pour intéragir avec la web app.

### Exemple d'utilisation:

<p align="center"> 
Aperçu de la page d'accueil après ajout de gags par les utilisateurs:
    <img src="readme/accueil.png"/> 
</p>
