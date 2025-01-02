INSERT INTO departments (department_name)
VALUES ('sales'),
       ('engineering'),
       ('finance'),
       ('legal');

INSERT INTO roles (title, salary, department_id)
VALUES ('sales lead', 110000, 1),
       ('salesperson', 100000, 1),
       ('lead engineer', 120000, 2),
       ('software engineer', 110000, 2),
       ('account manager', 75000, 3),
       ('accountant', 50000, 3),
       ('legal team lead', 65000, 4),
       ('lawyer', 60000, 4);

INSERT INTO employees (first_name, last_name, role_title, manager_id)
VALUES ('john', 'doe', 'sales lead', null),
       ('jane', 'doe', 'account manager', null),
       ('george', 'washington', 'lead engineer', null),
       ('jean-luc', 'picard', 'legal team lead', null),
       ('joe', 'schmoe', 'software engineer', 3),
       ('jim', 'schmim', 'accountant', 2),
       ('saul', 'goodman', 'lawyer', 4),
       ('billy', 'mays', 'salesperson', 1)