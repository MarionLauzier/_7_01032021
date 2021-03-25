
-- open an mysql session and import this file or copy paste the following instructions in the terminal.

CREATE USER 'gaguser'@'localhost' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON groupomania.* TO 'gaguser'@'localhost';

CREATE DATABASE groupomania;