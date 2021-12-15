const bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const User = require("../model/User");
const {database} = require("../../config/mysql/database");


function login(user_p, callback) {
    getUser(user_p, callback)
}

// TODO - this is just to test login with database
function register(user_p, callback) {
    const response = {
        status: 0,
        message: "",
        user_id: null, // null = user already exists
    };

    //Create new user
    // TODO - check if password not empty
    const newUser = {
        name: user_p.name,
        email: user_p.email,
        is_active: user_p.is_active ?? false,
        auth_id: user_p.auth_id ?? '',
        password: bcrypt.hashSync(user_p.password, saltRounds),
        role: "ROLE_USER"
    }

    // Getting connection from pool
    database.pool.getConnection((err, connection) => {
        if (err) {
            response.status = 1; // 1 = Error
            response.message = "Error connecting to database";
            response.user_id = null;
            return callback(response);
        }

        connection.query("INSERT INTO users SET ?", newUser, (err, result) => {
            connection.release();
            if (err) {
                response.status = 401; // 401 = Unauthorized
                response.message = err.message;
                response.user_id = null;
            } else {
                response.status = 201; // 0 = Success
                response.message = "User created";
                response.user_id = result.insertId;
            }
            return callback(response);
        });
    });
}

// TODO - this is just to test login with database
function registerGoogle(user_p, callback) {
    const response = {
        status: 0,
        message: "",
        user_id: null, // null = user already exists
    };

    // //Create new user
    const newUser = {
        name: user_p.name,
        email: user_p.email,
        is_active: user_p.is_active ?? false,
        auth_id: user_p.auth_id ?? '',
        password: '',
        role: "ROLE_USER"
    }

    // Create New User by Google infos
    database.pool.getConnection((err, connection) => {
        if (err) {
            response.status = 404; // 1 = Error
            response.message = "Error connecting to database";
            response.user_id = null;
            return callback(response);
        }

        connection.query("INSERT INTO users SET ?", newUser, (err, result) => {
            connection.release();
            if (err) {
                response.status = 401; // 401 = Unauthorized
                response.message = err.message;
                response.user_id = null;
                return callback(response);
            } else {
                response.status = 201; // 0 = Success
                response.message = "User created";
                response.user_id = result.insertId;
            }
            return callback(null, response);
        });
    });
}

//TODO - REFACTOR with getUser
function getUserBy(id, callback) {
    const response = {
        status: 0,
        message: "",
        user_id: null, // null = user already exists
    };
    // Getting connection from pool
    database.pool.getConnection((err, connection) => {
        if (err) {
            response.status = 401; // 1 = Error
            response.message = "Error connecting to database";
            response.user_id = null;
            return callback(response);
        }

        connection.query({
            sql: "SELECT id, name, email, role, password, is_active, " +
                "DATE_FORMAT(subscribed_at, '%d/%d/%Y %H:%i:%S') " +
                "as subscribed, DATE_FORMAT(updated_at, '%d/%d/%Y %H:%i:%S') as updated FROM users WHERE id = ?",
            timeout: 40000, // 40s
            values: [id]
        }, (err, result) => {

            connection.release();
            if (err) {
                response.status = 404; // 404 = Not found
                response.message = err.message;
                response.user_id = null;
                return callback(response);
            }

            if (result.length === 0 ) {
                // User not found
                response.status = 404; // 404 = Not found
                response.message = "User not found";
                return callback(response);
            } else {
                // User found
                response.status = 200; // 0 = Success
                response.message = "User found";
                response.user = new User(result[0].id, result[0].name, result[0].email, '', result[0].role);
                response.user.subscribed_at = result[0].subscribed;
                response.user.updated_at = result[0].updated;
                return callback(null, response);
            }
        });
    });
}

//TODO - REFACTOR with getUser
function deleteUser(user_id, callback) {
    const response = {
        status: 0,
        message: "",
    };
    // Getting connection from pool
    database.pool.getConnection((err, connection) => {
        if (err) {
            response.status = 401; // 1 = Error
            response.message = "Error connecting to database";
            return callback(response);
        }

        connection.query({
            sql: "DELETE FROM users WHERE id = ?",
            timeout: 40000, // 40s
            values: [user_id]
        }, (err, result) => {
            connection.release();
            if (err) {
                response.status = 401; // 404 = Not found
                response.message = err.message;
                return callback(response);
            }

            if ( result.affectedRows === 0 ) {
                // User not found
                response.status = 404; // 404 = Not found
                response.message = 'User not found';
                return callback(response);
            } else {
                // User found
                response.status = 200; // 0 = Success
                response.message = 'User deleted successfully';
                return callback(null, response);
            }
        });
    });
}

//TODO - REFACTOR with getUser
function getUserByEmail(email, callback) {
    const response = {
        status: 0,
        message: "",
        user_id: null, // null = user already exists
    };
    // Getting connection from pool
    database.pool.getConnection((err, connection) => {
        if (err) {
            response.status = 401; // 1 = Error
            response.message = "Error connecting to database";
            response.user_id = null;
            return callback(response);
        }

        connection.query({
            sql: "SELECT id, name, email, role, password, is_active, " +
                "DATE_FORMAT(subscribed_at, '%d/%d/%Y %H:%i:%S') " +
                "as subscribed, DATE_FORMAT(updated_at, '%d/%d/%Y %H:%i:%S') as updated FROM users WHERE email = ?",
            timeout: 40000, // 40s
            values: [email]
        }, (err, result) => {

            connection.release();
            if (err) {
                response.status = 404; // 404 = Not found
                response.message = err.message;
                response.user_id = null;
                return callback(response);
            }

            if (result.length === 0 ) {
                // User not found
                response.status = 404; // 404 = Not found
                response.message = "User not found";
                return callback(response);
            } else {
                // User found
                response.status = 200; // 0 = Success
                response.message = "User found";
                response.user = new User(result[0].id, result[0].name, result[0].email, '', result[0].role);
                response.user.subscribed_at = result[0].subscribed;
                response.user.updated_at = result[0].updated;
                return callback(null, response);
            }
        });
    });
}

function getUser(user, callback) {
    const response = {
        status: 0,
        message: "",
        user_id: null, // null = user already exists
    };
    // Getting connection from pool
    database.pool.getConnection((err, connection) => {
        if (err) {
            response.status = 401; // 1 = Error
            response.message = "Error connecting to database";
            response.user_id = null;
            return callback(response);
        }

        connection.query({
            sql: "SELECT id, name, email, role, password, is_active, " +
                "DATE_FORMAT(subscribed_at, '%d/%d/%Y %H:%i:%S') " +
                "as subscribed, DATE_FORMAT(updated_at, '%d/%d/%Y %H:%i:%S') as updated FROM users WHERE email = ?",
            timeout: 40000, // 40s
            values: [user.email]
        }, (err, result) => {

            connection.release();
            if (err) {
                response.status = 404; // 404 = Not found
                response.message = err.message;
                response.user_id = null;
                return callback(response);
            }

            if (result.length === 0 || bcrypt.compareSync(user.password, result[0].password) === false) {
                // User not found
                response.status = 404; // 404 = Not found
                response.message = "email or password incorrect";
                return callback(response);
            } else {
                // User found
                response.status = 200; // 0 = Success
                response.message = "User found";
                response.user = new User(result[0].id, result[0].name, result[0].email, '', result[0].role);
                response.user.subscribed_at = result[0].subscribed;
                response.user.updated_at = result[0].updated;
                return callback(null, response);
            }
        });
    });
}

function checkUser(req) {
     try {
         // login by form
        return jwt.verify(req.cookies.token, process.env.JWT_SECRET);
     } catch (err) {
        return false;
     }
}

// TODO - verify soon
function getAll(callback) {
    const response = {
        status: 0,
        message: "",
        user_id: null, // null = user already exists
    };

    database.pool.getConnection((err, connection) => {
        if (err) {
            response.status = 401; // 1 = Error
            response.message = "Error connecting to database";
            response.user_id = null;
            return callback(response);
        }

        connection.query({
            sql: "SELECT id, name, email, role, password, is_active, " +
                "DATE_FORMAT(subscribed_at, '%d/%d/%Y %H:%i:%S') " +
                "as subscribed, DATE_FORMAT(updated_at, '%d/%d/%Y %H:%i:%S') as updated FROM users",
            timeout: 40000, // 40s
        }, (err, result) => {

            connection.release();
            if (err) {
                response.status = 404; // 404 = Not found
                response.message = err.message;
                response.user_id = null;
                return callback(response);
            }

            // User found
            response.message = "User found";
            response.users = result
            return callback(null, response);
        });
    });
}

// Just for testing
function dropAll(callback) {
    const response = {
        status: 0,
        message: "",
        user_id: null, // null = user already exists
    };

    database.pool.getConnection((err, connection) => {
        if (err) {
            response.status = 401; // 1 = Error
            response.message = "Error connecting to database";
            response.user_id = null;
            return callback(response);
        }

        connection.query({
            sql: "delete from users",
            timeout: 40000, // 40s
        }, (err, result) => {

            console.log("DELETE : ", result)
            connection.release();
            if (err) {
                response.status = 404; // 404 = Not found
                response.message = err.message;
                response.user_id = null;
                return callback(response);
            }
            // User found
            response.message = "User found";
            response.status = 200; // 0 = Success
            response.users = result
            return callback(null, response);
        });
    });
}

function deleteDatabase() {
    database.pool.getConnection((err, connection) => {
        connection.query({
            sql: "delete from users",
            timeout: 40000, // 40s
        }, (err, result) => {
            connection.release();
            //do nothind
        });
    });
}

module.exports = {
    login,
    register,
    checkUser,
    getUserBy,
    getUserByEmail,
    registerGoogle,
    deleteDatabase,
    deleteUser
}
