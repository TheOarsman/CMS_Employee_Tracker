DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,


    ON DELETE SET NULL
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT REFERENCES // ________ //
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE NOT NULL
);