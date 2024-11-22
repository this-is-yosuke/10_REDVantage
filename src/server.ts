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

// Using inquirer
inquirer.prompt([
    {
        type: "input",
        name: "test",
        message: "Testing to see if this works",
    }])
    .then((response) => {
        console.log(`${response.test}`);
        pool.query('SELECT * FROM employees', (err: Error, result: QueryResult) => {
            if(err){
                console.log(err);
            }else if (result) {
                console.log(result.rows);
            }
        })
    });

    // Default error message
    app.use((_req, res) => {
        res.status(404).end();
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })

    