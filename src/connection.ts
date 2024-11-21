import dotenv from 'dotenv'
dotenv.config();

import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 8001
});

const connectToDB = async () => {
    try{
        await pool.connect();
        console.log("Connected to the database.");
    } catch (err) {
        console.error("Error connecting to the database", err);
        process.exit(1);
    }
};

export { pool, connectToDB };

