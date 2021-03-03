CREATE USER 'gaguser'@'localhost' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON groupomania.* TO 'gaguser'@'localhost';

CREATE DATABASE groupomania;