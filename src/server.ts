import express, { application } from 'express';
import { Client, Connection, Pool, Query, QueryResult } from 'pg';
import { pool, connectToDB } from './connection.js';
import inquirer from 'inquirer';

await connectToDB();

const PORT = process.env.PORT || 3002;
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// ------------------------------------------------------------------------------------------------
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
                // allDepartmentNames.push(response.addDep);
                allDepartmentNames.push(response.addDep);
                startCli();
            })
        })
};
// Nested inquirer calls for INSERTing into roles queries
// extra function to store department names
// const [rows] = pool.query('SELECT * FROM departments');
// const choices = rows.map(row => ({name: row.name, value: row.id}));

// const [rows];
// const choices = pool.query('SELECT * FROM departments', (err: Error, result: QueryResult) => {
//     if(err){
//         console.log(err);
//     }else if(result){
//         rows.map(result.rows);
//     };
// })

// let allDepartments;
// pool.query('SELECT * FROM departments', (err: Error, result: QueryResult) => {
//     if(err){
//         console.log(err);
//     }else if(result){
//         allDepartments = result.rows;
//         return allDepartments;
//     }
// })

// let allDepartments: QueryResult[] = pool.query('SELECT * FROM departments', (err: Error, result: QueryResult) => {
//     if(err){
//         console.log(err);
//     }else if(result){
//         allDepartments = result.rows;
//     }
// })

//Generating a usable array for the SELECT prompt----------------------------------------------- 
// Storing DEPARTMENTS in an array
// Putting this in the addRole() function causes the app to crash. It's a syntax error?
let resultD = await pool.query('SELECT * FROM departments');
// let result = Client.;
let queryArray = resultD.rows;
// We can access the column name via queryArray[i].department_name
console.log(`querryArray: ${queryArray[0].value}, ${queryArray[1].department_name}, and ${queryArray.length}`);
// console.log(`${queryArray.department_name}`); the property doesn't exist on the array itself
let allDepartmentNames: string[] = [];
let allDepartmentIDs: number[] = [];
for(let i = 0; i < queryArray.length; i++){
    allDepartmentNames[i] = queryArray[i].department_name;
    allDepartmentIDs[i] = queryArray[i].department_id;
};
allDepartmentNames.unshift("cancel");
console.log(`All departments: ${allDepartmentNames} (I would like a cancel feature)`);

// let depts = await pool.query('SELECT department_name FROM departments');
// Storing ROLES in an array
let resultR = await pool.query('SELECT * FROM roles');
let querryArrayR = resultR.rows;
let allRoles: string[] = []
let roleIDs: number[] = [];
for(let i = 0; i < querryArrayR.length; i++){
    allRoles[i] = querryArrayR[i].title;
    roleIDs[i] = querryArrayR[i].id;
};
allRoles.unshift("cancel");
console.log(`All roles: ${allRoles}, and their IDs: ${roleIDs}`);

// Storing ALL employees in an array
let resultE = await pool.query('SELECT * FROM employees');
let querryArrayE = resultE.rows;
let allEmployees: string[] = [];
let employeeIDs: number[] = [];
let IDtoDelete: number; //using in the deleteEmployee method
for(let i = 0; i < querryArrayE.length; i++){
    allEmployees[i] = querryArrayE[i].first_name + ", " + querryArrayE[i].last_name;
    employeeIDs[i] = querryArrayE[i].id;
};
allEmployees.unshift("cancel");

// Storing MANAGERS in an array
let resultM = await pool.query('SELECT first_name, last_name FROM employees WHERE manager_id=NULL');
let queryArrayM = resultM.rows;
let allManagers : string[] = [];
let managerIDs: number[] = [];
for(let i = 0; i < queryArrayM.length; i++){
    allManagers[i] = queryArrayM[i].first_name + ", " + queryArrayM[i].last_name;
    managerIDs[i] = queryArrayM[i].id;
};
// -----------------------------------------------------------------------------------------------
function addRole(): void {
    
    inquirer.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "What role would you like to add?",
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the role's salary?",
        },
        {
            // type: "input",
            // name: "roleDepartment",
            // message: "Which department does this role belong to?",
            type: "list",
            name: "roleDepartment",
            message: "Which department does this role belong to?",
            // choices: allDepartments,
            choices: allDepartmentNames,
        }
    ])
    .then((response) => {
        /* Neither id nor department_id work. ${resonse.roleDepartment} gives an input syntax error in the console. It's expecting an integer, but it
           recieved a string. The thing is, it needs an array to work. If presented with IDs and names, it throws an error.
           */
          let place = allDepartmentNames.indexOf(response.roleDepartment) +1;
        console.log(`${response.roleDepartment} is the role department.`);
        pool.query(`INSERT INTO roles(title, salary, department_id) VALUES ('${response.roleTitle}', ${response.roleSalary}, '${place}')`,
            (err: Error, result: QueryResult) => {
                if(err){
                    console.log(err);
                }else if(result) {
                    allRoles.push(response.roleTitle);
                    console.log("Data successfully entered!");
                };
                startCli();
        });
    })
};
//----------------------------------------------------------------------------------------------------------
// Add employee 
// Nested inquirer calls for INSERTing into employees queries
function addEmployee(): void {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Please enter the employee's first name.",
        },
        {
            type: "input",
            name: "lastName",
            message: "Please enter the employee's last name.",
        },
        // {
        //     type: "input",
        //     name: "roleID",
        //     message: "Please enter the employee's role ID.",
        // }
        {
            type: "select",
            name: "roleTitle",
            message: "Please enter the employee's role title.",
            choices: allRoles,
        },
        {
            type: "input",
            name: "managerID",
            message: "Please enter the employee's manager's ID. If you are the manager, then press ENTER.",
        }
    ])
    .then((response) => {
        // let managersIndex = ;
        // let chosenManager = employeeIDs[managersIndex];
        // Preventing empty strings from being assigned to firstName and lastName
        if(response.firstName === ''|| response.lastName === ''){
            console.log("First name and last name cannot be blank. Please try again.");
            startCli();
        }else{
            /* Leaving a prompt blank does not result in NULL, but in an empty string;
               since managerID wants INT, it throws an error. */
            if(response.managerID === ''){response.managerID = null};
            pool.query(`INSERT INTO employees (first_name, last_name, role_title, manager_id) VALUES ('${response.firstName}', '${response.lastName}', '${response.roleTitle}', ${response.managerID})`, 
                (err: Error, result: QueryResult) => {
                    if(err){
                        console.log(err);
                        console.log(`The manager id: ${response.managerID}, type: ${typeof response.managerID}`);
                    }else if(result) {
                        allEmployees.push(response.firstName + ', ' + response.lastName);
                        
                        console.log("Data successfully entered.");
                    }
                    startCli();
                });
            };
        });
    };
// Nested inquirer calls for UPDATE-ing employees queries
// function updateEmployee(): void {};

// --------------------------------------------------------------------------
// DELETE queries start
function deleteDepartment(): void {
    inquirer.prompt([
        {
            type: 'list',
            name: 'departmentDeletion',
            message: 'Select which department you want to terminate.',
            choices: allDepartmentNames
        }
    ]).then((response) => {
        console.log(`From within deleteDepartments(), the response ${response} and the response.departmentDeletion ${response.departmentDeletion}`);
        // response.departmentDeletion is what the user selects, their choice
        console.log(`result.departmentDeletion.id? ${response.departmentDeletion.id}`);
        /* response.departmentDeletion.id returns "undefined". Keep in mind that allDepartments is a string[]
           containing only the department names and not their IDs.*/
        if(response.departmentDeletion === "cancel"){
            startCli();
        }else{
            pool.query(`DELETE FROM departments WHERE department_name='${response.departmentDeletion}'`, (err: Error, result: QueryResult) => {
                if(err){
                    console.log(err);
                }else if(result){
                    console.log("Record successfully deleted.");
                };
                let deletedItem = allDepartmentNames.indexOf(response.departmentDeletion);
                allDepartmentNames.splice(deletedItem, 1);
                console.log(`allDpeartmentNames: ${allDepartmentNames}`);
                startCli();
            });
        }
    })
};

function deleteRole(): void {
    inquirer.prompt([
        {
            type: 'list',
            name: 'roleDeletion',
            message: 'Select which role you want to terminate.',
            choices: allRoles
        }
    ]).then((response) => {
        if(response.roleDeletion === "cancel"){
            startCli();
        }else{
            pool.query(`DELETE FROM roles WHERE title='${response.roleDeletion}'`, (err: Error, result: QueryResult) => {
                if(err){
                    console.log(err);
                }else if(result){
                    console.log("Record successfully deleted.");
                }; 
                let deletedItem = allRoles.indexOf(response.roleDeletion);
                allRoles.splice(deletedItem, 1);
                console.log(`allRoles: ${allRoles}`);
                startCli();
            });
        }
    })
};
function deleteEmployee(): void {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employeeDeletion',
            message: 'Select who you want to terminate.',
            choices: allEmployees
        }
    ]).then((response) => {
        if(response.employeeDeletion === "cancel"){
            startCli();
        }else{
            // I want to pull from employeeIds where the id matches the selected name
            console.log(`The response: ${response}, ${typeof response}`); //type object
            // time tto cookkkkk
            pool.query(`SELECT * FROM employees`, (err: Error, result: QueryResult) => {
                if(err){
                    console.log(err)
                }else if(result){
                    let currentEmployees = result.rows;
                    console.log(`resultRow length: ${currentEmployees.length}`); //it's 12??? of course it is
                    let recordToDelete = currentEmployees.findIndex(record => `${record.first_name}, ${record.last_name}` === response.employeeDeletion);
                    console.log(`The index of the person to terminate: ${recordToDelete}`);
                    console.log(`The first_name of the 12th employee: ${currentEmployees[11].first_name}`);
                    IDtoDelete = currentEmployees[recordToDelete].id;
                    console.log(`The value of IDtoDelete: ${IDtoDelete}`);
                }
            })
            // yea boiii
            console.log(`Right before the DELETE query, this is IDtoDelete: ${IDtoDelete}`);
            pool.query(`DELETE FROM employees WHERE id=${IDtoDelete}`, (err: Error, result: QueryResult) => {
                if(err){
                    console.log(err);
                }else if(result){
                    console.log("Record successfully deleted.");
                };
                startCli();
            });
        }
    })
};
// DELETE queries end
// --------------------------------------------------------------------------

// Initial inquirer call
function startCli(): void {

    inquirer.prompt([
        {
            type: "list",
            name: "dbQuery",
            message: "Welcome to your content management system! What would you like to do?",
            choices: ['Select all departments', 'Select all roles', 'Select all employees', 'Add a department',
                'Add a role', 'Add an employee', 'Update an employee', 'Delete a department', 'Delete a role',
                'Delete an employee', 'Exit'],
        }])
        .then((response) => {
            // console.log(`${response.dbQuery}`);
            switch (response.dbQuery) {
                case 'Select all departments':
                    pool.query('SELECT * FROM departments', (err: Error, result: QueryResult) => {
                        if(err){
                            console.log(err);
                        }else if(result) {
                            console.table(result.rows);
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
                            console.table(result.rows);
                        }
                        startCli();
                    });
                    break;
                case 'Select all employees':
                    pool.query('SELECT * FROM employees', (err: Error, result: QueryResult) => {
                        if(err){
                            console.log(err);
                        }else if (result) {
                            console.table(result.rows);
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
                case 'Delete a department':
                    deleteDepartment();
                    break;
                case 'Delete a role':
                    deleteRole();
                    break;
                case 'Delete an employee':
                    deleteEmployee();
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

    