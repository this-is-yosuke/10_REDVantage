import express, { application } from 'express';
import { Client, Connection, Pool, QueryResult } from 'pg';
import { pool, connectToDB } from './connection.js';
import inquirer from 'inquirer';

await connectToDB();

const PORT = process.env.PORT || 3002;
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Using inquirer

// Nested inquirer calls for INSERTing into departmentsqueries
function addDepartment(): void {
    inquirer.prompt([
        {
            type: "input",
            name: "addDep",
            message: "What is the department name you would like to add?",
        }])
        .then((response) => {
            pool.query(`INSERT INTO departments (department_name) VALUES ('${response.addDep}')`, (err: Error, result: QueryResult) => {
                if(err) {
                    console.log(err);
                }else if(result) {
                    console.log("Data successfully entered!");
                }
                startCli();
            })
        })
};
// Nested inquirer calls for INSERTing into roles queries
function addRole(): void {
    inquirer.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "What role would you like to add?",
        }
        {
            type: "input",
            name: "roleSalary",
            message: "What is the role's salary?",
        }
        {
            type: "input",
            name: "roleDepartment",
            message: "Which department does this role belong to?",
        }
    ])
    .then((response) => {
        pool.query(`INSERT INTO roles(title, salary, department) VALUES ('${response.roleTitle}', ${response.roleSalary}, '${response.roleDepartment}')`,
            (err: Error, result: QueryResult) => {
                if(err){
                    console.log(err);
                }else if(result) {
                    console.log("Data successfully entered!");
                };
                startCli();
        });
    })
};
// Nested inquirer calls for INSERTing into employees queries
function addEmployee(): void {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Please enter the employee's first name.",
        }
        {
            type: "input",
            name: "lastName",
            message: "Please enter the employee's last name.",
        }
        {
            type: "input",
            name: "roleID",
            message: "Please enter the employee's role ID.",
        }
        {
            type: "input",
            name: "managerID",
            message: "Please enter the employee's manager's ID.",
        }
    ])
    .then((response) => {
        pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${response.firstName}', '${response.lastName}', ${response.roleID}, ${response.managerID})`, 
            (err: Error, result: QueryResult) => {
                if(err){
                    console.log(err);
                }else if(result) {
                    console.log("Data successfully entered.");
                }
                startCli();
            });
        });
    };
// Nested inquirer calls for UPDATE-ing employees queries
// function updateEmployee(): void {};

// Initial inquirer call
function startCli(): void {

    inquirer.prompt([
        {
            type: "list",
            name: "dbQuery",
            message: "Welcome to your content management system! What would you like to do?",
            choices: ['Select all departments', 'Select all roles', 'Select all employees', 'Add a department',
                'Add a role', 'Add an employee', 'Update an employee', 'Exit'],
        }])
        .then((response) => {
            // console.log(`${response.dbQuery}`);
            switch (response.dbQuery) {
                case 'Select all departments':
                    pool.query('SELECT * FROM departments', (err: Error, result: QueryResult) => {
                        if(err){
                            console.log(err);
                        }else if(result) {
                            console.log(result.rows);
                        }
                        startCli();
                    });
                    break;
                    // startCli();
                case 'Select all roles':
                    pool.query('SELECT * FROM roles', (err: Error, result: QueryResult) => {
                        if(err){
                            console.log(err);
                        }else if(result) {
                            console.log(result.rows);
                        }
                        startCli();
                    });
                    break;
                case 'Select all employees':
                    pool.query('SELECT * FROM employees', (err: Error, result: QueryResult) => {
                        if(err){
                            console.log(err);
                        }else if (result) {
                            console.log(result.rows);
                        }
                        startCli();
                    })
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee':
                    break;
                default:
                    console.log("Have a nice day!");
                //    process.abort(); works, BUT generates a stack trace in the console
                    // process.disconnect(); not a function?
                    process.exit();
            }
        });
};
startCli();

    // Default error message
    app.use((_req, res) => {
        res.status(404).end();
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })

    