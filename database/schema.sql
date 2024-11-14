DROP DATABASE IF EXISTS redvantage_db;
CREATE DATABASE redvantage_db;

\c redvantage_db

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL
    last_name VARCHAR(100) NOT NULL
    role_id INT
    manager_id INT
    FOREIGN KEY (role_id) REFERENCES roles(id)
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY
    department_name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY
    title VARCHAR(100) NOT NULL
    salary NUMBER NOT NULL
    department INT
    FOREIGN KEY (department_id) REFERENCES departments(id)
);