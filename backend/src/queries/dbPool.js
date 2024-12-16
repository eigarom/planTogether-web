require("dotenv").config();
const { Pool } = require("pg");

const dbConfig = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
};

module.exports = new Pool(dbConfig);
