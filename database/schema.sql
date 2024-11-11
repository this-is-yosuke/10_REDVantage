DROP DATABASE IF EXISTS redvantage_db;
CREATE DATABASE redvantage_db;

\c redvantage_db

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_firstName VARCHAR(100) NOT NULL
    employee_lastName VARCHAR(100) NOT NULL
    role_id INT
    department_id INT
    role_salary INT
    manager_id INT
    FOREIGN KEY (role_id) REFERENCES roles(id)
    FOREIGN KEY (department_id) REFERENCES departments(id)
    FOREIGN KEY (role_salary) REFERENCES roles(salary)
    FOREIGN KEY (manager_id) REFERENCES managers(id)
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY
    department_name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY
    role_name VARCHAR(100) NOT NULL
    department_id INT
    FOREIGN KEY (department_id) REFERENCES departments(id)
    salary NUMBER NOT NULL
);

CREATE TABLE managers (
    id SERIAL PRIMARY KEY
    manager_fullName VARCHAR(100) NOT NULL
    department_id INT
    FOREIGN KEY (department_id) REFERENCES departments(id)
);