CREATE DATABASE jit_system;
USE jit_system;

CREATE TABLE materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    materialName VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    urgency VARCHAR(50) NOT NULL
);
