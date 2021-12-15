const mongoClient = require('mongodb').MongoClient
const env = require('dotenv').config()

class Database {
    constructor() {
        this.pool = mysql.createPool(
            {
                connectionLimit: 10,
                host: env.parsed.BD_HOST,
                user: env.parsed.BD_USER,
                password: env.parsed.BD_PASS,
                database: env.parsed.BD_NAME
            }
        );
        this.getPool = this.getPool.bind(this);
    }

    getPool() {
        return this.pool;
    }

    // TODO - to create methods query, etc
}

module.exports = {
    database : new Database()
}
