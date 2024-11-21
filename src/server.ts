import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDB } from './connection';

await connectToDB();

const PORT = process.env.PORT || 3002;
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());