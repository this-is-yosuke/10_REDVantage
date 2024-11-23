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
function startCli(): void {

    inquirer.prompt([
        {
            type: "list",
            name: "dbQuery",
            message: "Pick your poison!",
            choices: ['Select all departments', 'Select all roles', 'Select all employees', 'Add a department',
                'Add a role', 'Add an employee', 'Update an employee', 'Exit'],
        }])
        .then((response) => {
            console.log(`${response.dbQuery}`);
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
                    break;
                case 'Add a role':
                    break;
                case 'Add an employee':
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

    