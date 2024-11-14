INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('john', 'doe', 1, null),
       ('jane', 'doe', 5, null),
       ('george', 'washington', 4, null),
       ('joe', 'schmoe', 6, 2)
       ('jean-luc', 'picard', 7, null)
       ('jim', 'schmim', 8, 5)
       ('saul', 'goodman', 2, 1)

INSERT INTO departments (department_name)
VALUES ('sales'),
       ('engineering'),
       ('finance'),
       ('legal')

INSERT INTO roles (title, salary, department)
VALUES ('sales lead', 110000, 1),
       ('salesperson', 100000, 1),
       ('lead engineer', 120000, 2),
       ('software engineer', 110000, 2),
       ('account manager', 75000, 3),
       ('accountant', 50000, 3),
       ('legal team lead', 65000, 4),
       ('lawyer', 60000, 4)