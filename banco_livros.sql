DROP DATABASE IF EXISTS banco_livros;

CREATE DATABASE banco_livros;
USE banco_livros;

CREATE TABLE livros (
	id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
	autor VARCHAR(255) NOT NULL,
    nota INT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

DESCRIBE livros;

USE banco_livros;
SELECT * FROM livros;