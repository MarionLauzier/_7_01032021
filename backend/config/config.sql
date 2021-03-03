CREATE USER 'gaguser'@'localhost' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON groupomania.* TO 'gaguser'@'localhost';

CREATE DATABASE groupomania;

INSERT INTO users (pseudo, email, password, departement, createdAt, updatedAt)
    -> VALUES ('batman', 'jean@groupomania.com', 'mypassword', 'RH',NOW(), Now());

    INSERT INTO gags (description, imageUrl, userId, likes, dislikes, nbComments, createdAt, updatedAt)
    -> VALUES ('top gag', 'image', 1, 0,0,0, NOW(), NOW());