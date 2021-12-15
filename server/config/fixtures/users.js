const bcrypt  = require("bcrypt");
const salt = 10;
const sqlFixtures = require('sql-fixtures');
const env = require('dotenv').config();

const dbConfig = {
    client: 'mysql',
    connection: {
        host: env.parsed.BD_HOST,
        user: env.parsed.BD_USER,
        password: env.parsed.BD_PASS,
        database: env.parsed.BD_NAME,
        port: 3306
    }
};

const dataSpec = {
    users: [
        {
            name: 'user1',
            email: 'user1@example.com',
            password: bcrypt.hashSync('test', salt),
            role: 'ROLE_USER',
        },
        {
            name: 'user2',
            email: 'user2@example.com',
            password: bcrypt.hashSync('test', salt),
            role: 'ROLE_USER',
        },
        {
            name: 'admin1',
            email: 'admin1@example.com',
            password: bcrypt.hashSync('test', salt),
            role: 'ROLE_ADMIN',
        },
        {
            name: 'admin2',
            email: 'admin2@example.com',
            password: bcrypt.hashSync('test', salt),
            role: 'ROLE_USER',
        }
    ]
};

sqlFixtures.create(dbConfig, dataSpec, function(err, result) {
    // at this point a row has been added to the users table
    return
});
