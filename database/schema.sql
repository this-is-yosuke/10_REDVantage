DROP DATABASE IF EXISTS redvantage_db;
CREATE DATABASE redvantage_db;

\c redvantage_db

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    salary INTEGER NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_title VARCHAR(100),
    manager_id INT,
    FOREIGN KEY (role_title) REFERENCES roles(title),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);