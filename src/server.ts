import express from 'express';
import { QueryResult } from 'pg';
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
                allDepartmentNames.push(response.addDep);
                startCli();
            })
        })
};

//Generating a usable array for the SELECT prompt----------------------------------------------- 
// Storing DEPARTMENTS in an array
// Putting this in the addRole() function causes the app to crash.
let resultD = await pool.query('SELECT * FROM departments');
let queryArrayD = resultD.rows;
let allDepartmentNames: string[] = [];
let allDepartmentIDs: number[] = [];
for(let i = 0; i < queryArrayD.length; i++){
    allDepartmentNames[i] = queryArrayD[i].department_name;
    allDepartmentIDs[i] = queryArrayD[i].department_id;
};
allDepartmentNames.unshift("cancel");

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

// Storing ALL employees in an array
let resultE = await pool.query('SELECT * FROM employees');
let querryArrayE = resultE.rows;
let allEmployees: string[] = [];
let employeeIDs: number[] = [];
let employeeRoles: string[] = [];
let IDtoDelete: number; //using in the deleteEmployee method
let currentEmployees: any[];
for(let i = 0; i < querryArrayE.length; i++){
    allEmployees[i] = querryArrayE[i].first_name + ", " + querryArrayE[i].last_name;
    employeeIDs[i] = querryArrayE[i].id;
    employeeRoles[i] = querryArrayE[i].role_title;
};
allEmployees.unshift("cancel");

// Storing MANAGERS in an array
let resultM = await pool.query('SELECT * FROM employees WHERE manager_id IS NULL');
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
            type: "list",
            name: "roleDepartment",
            message: "Which department does this role belong to?",
            choices: allDepartmentNames,
        }
    ])
    .then((response) => {
        /* Neither id nor department_id work. ${resonse.roleDepartment} gives an input syntax error in the console.
           It's expecting an integer, but it recieved a string. The thing is, it needs an array to work. If presented
           with IDs and names, it throws an error.
           */
          let place = allDepartmentNames.indexOf(response.roleDepartment);
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
        // Preventing empty strings from being assigned to firstName and lastName
        if(response.firstName === ''|| response.lastName === ''){
            console.log("First name and last name cannot be blank. Please try again.");
            startCli();
        }else{
            /* Implementing a cancel option, since it's already in the array */
            if(response.roleTitle === 'cancel'){
                console.log(`Employee creation aborted`);
                startCli();
            }else{
                /* Leaving a prompt blank does not result in NULL, but in an empty string;
                   since managerID wants INT, it throws an error. */
                if(response.managerID === ''){response.managerID = null};
                pool.query(`INSERT INTO employees (first_name, last_name, role_title, manager_id) VALUES ('${response.firstName}', '${response.lastName}', '${response.roleTitle}', ${response.managerID})`, 
                    (err: Error, result: QueryResult) => {
                        if(err){
                            console.log(err);
                        }else if(result) {
                            allEmployees.push(response.firstName + ', ' + response.lastName);
                            
                            console.log("Data successfully entered.");
                        }
                        startCli();
                    });
                };
            };
        });
    };
// Nested inquirer calls for UPDATE-ing employees queries
function updateEmployee(): void {
    inquirer.prompt([
        {
            type: 'list',
            name: 'chooseEmployee',
            message: 'Please select an employee to update their role.',
            choices: allEmployees
        }
    ]).then((response1) => {
        if(response1.chooseEmployee === 'cancel'){
            console.log("Employee update aborted");
            startCli();
        }else{
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'chooseNewRole',
                    message: 'Please select their new role.',
                    choices: allRoles
                }
            ]).then((response2) => {
                if(response2.chooseNewRole === 'cancel'){
                    console.log("Employee update aborted");
                    startCli();
                }else{
                    // Updating an employee's role
                    let recordToUpdate = currentEmployees.findIndex(record => `${record.first_name}, ${record.last_name}` === response1.chooseEmployee);
                    let IDtoUpdate = currentEmployees[recordToUpdate].id;
                    /* Using a 3rd prompt to display a list of managers to assign the employee. They can't still be under the
                       legal team lead if they are now a software developer, can they?*/
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'selectManager',
                            message: 'Please specify their new manager.',
                            choices: allManagers
                        }
                    ]).then((response3) => {
                        let newManager = allManagers.findIndex(record => record.includes(response3.selectManager));
                        let newManagerID = queryArrayM[newManager].id;
                        // Using a parameterized query
                        pool.query(`UPDATE employees SET role_title = $1, manager_id = $2 WHERE employees.id = $3`, [response2.chooseNewRole, newManagerID, IDtoUpdate], (err: Error, result: QueryResult) => {
                            if(err){
                                console.log(err);
                            }else if(result){
                                console.log("Record successfully updated.");
                            };
                            startCli();
                        });
                    })

                };
            });
        }
    })
};

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
        /* response.departmentDeletion.id returns "undefined". Keep in mind that allDepartments is a string[]
           containing only the department names and not their IDs.*/
        if(response.departmentDeletion === "cancel"){
            console.log(`Department deletion aborted`);
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
            console.log(`Role deletion aborted`);
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
            console.log(`Employee deletion aborted`);
            startCli();
        }else{
            // I want to pull from employeeIds where the id matches the selected name
                    let recordToDelete = currentEmployees.findIndex(record => `${record.first_name}, ${record.last_name}` === response.employeeDeletion);
                    IDtoDelete = currentEmployees[recordToDelete].id;
            
            // Using parameterized queries
            pool.query(`DELETE FROM employees WHERE id=$1`, [IDtoDelete], (err: Error, result: QueryResult) => {
                if(err){
                    console.log(err);
                }else if(result){
                    // This removes the deleted name from the selection lists in the CLI
                    allEmployees = allEmployees.filter(person => person != `${response.employeeDeletion}`);
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

    // This query is important because without it, the selection options would not contain freshly entered data!
    pool.query(`SELECT * FROM employees`, (err: Error, result: QueryResult) => {
        if(err){
            console.log(err)
        }else if(result){
            currentEmployees = result.rows;
        }
    })
    
    inquirer.prompt([
        {
            type: "list",
            name: "dbQuery",
            message: "Welcome to your content management system! What would you like to do?",
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department',
                'Add a role', 'Add an employee', "Update an employee's role", 'Delete a department', 'Delete a role',
                'Delete an employee', 'Exit'],
        }])
        .then((response) => {
            switch (response.dbQuery) {
                case 'View all departments':
                    pool.query('SELECT * FROM departments', (err: Error, result: QueryResult) => {
                        if(err){
                            console.log(err);
                        }else if(result) {
                            console.table(result.rows);
                        }
                        startCli();
                    });
                    break;
                case 'View all roles':
                    // Implementing a JOINS clause to also show department names
                    pool.query('SELECT roles.*, departments.department_name FROM roles INNER JOIN departments ON roles.department_id=departments.id', (err: Error, result: QueryResult) => {
                        if(err){
                            console.log(err);
                        }else if(result) {
                            console.table(result.rows);
                        }
                        startCli();
                    });
                    break;
                case 'View all employees':
                    // Implementing a JOINS clause in order to show emploee salary
                    pool.query('SELECT employees.*, roles.salary, roles.department_id FROM employees LEFT JOIN roles ON employees.role_title=roles.title', (err: Error, result: QueryResult) => {
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
                case "Update an employee's role":
                    updateEmployee();
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

    