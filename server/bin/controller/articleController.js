const {database} = require("../../config/mysql/database");
const Article = require("../model/Article");
const {sql} = require("googleapis/build/src/apis/sql");
// TODO - to do
function update() {

}

// TODO - this is just to test login with database
function create(article_p, callback) {
    const response = {
        status: 500, // 500 = Internal Server Error
        message: 'Error connecting to database',
        article: null,
    };

    //Create new user
    // TODO - check if password not empty
    const newArticle = Article.createArticle(article_p)

    // Getting connection from pool
    database.pool.getConnection((err, connection) => {
        if (err) {
            return callback(response);
        }

        connection.query("INSERT INTO users SET ?", newArticle, (err, result) => {
            connection.release();
            if (err) {
                response.status = 401; // 401 = Unauthorized
                response.message = err.message;
                return callback(response);
            } else {
                response.status = 201; // 0 = Success
                response.message = "Article created";
                response.article = result.article;
                return callback(null, response);
            }
        });
    });
}

//TODO - Find artciel by ID to optimize
// TODO - to return the last published article
function find(id, callback) {
    const response = {
        status: 500, // 500 = Internal Server Error
        message: 'Error connecting to database',
        article: null,
    };

    // Getting connection from pool
    database.pool.getConnection((err, connection) => {
        if (err) {
            return callback(response);
        }

        connection.query({
            sql:"SELECT id, title, summary, source, article_url, image_url, user_id," +
                "DATE_FORMAT(created_at, '%d/%d/%Y %H:%i:%S') " +
                "as created, DATE_FORMAT(updated_at, '%d/%d/%Y %H:%i:%S') " +
                "as updated FROM articles WHERE id = ?",
            timeout: 40000,
            values: [id]
        }, (err, result) => {
            connection.release();
            if (err) {
                response.status = 401; // 401 = Unauthorized
                response.message = err.message;
                return callback(response);
            }

            if (result.length === 0 ) {
                // User not found
                response.status = 404; // 404 = Not found
                response.message = "Article not found";
                return callback(response);
            } else {
                // User found
                response.status = 200; // 0 = Success
                response.message = "Article found";
                response.article = Article.createArticle(result[0]);
                return callback(null, response);
            }
        });
    });
}

//TODO - to adapt it according parameters
// TODO - to return the last published article
function findBy(params = null, callback) {
    const response = {
        status: 500, // 500 = Internal Server Error
        message: 'Error connecting to database',
        articles: {},
    };

    // Getting connection from pool
    database.pool.getConnection((err, connection) => {

        if (err) {
            return callback(response);
        }

        if (params) {
            connection.query( {
                sql: "SELECT id, title, summary, source, article_url, image_url, user_id," +
                    "DATE_FORMAT(created_at, '%d/%d/%Y %H:%i:%S') " +
                    "as created, DATE_FORMAT(updated_at, '%d/%d/%Y %H:%i:%S') as updated FROM articles WHERE user_id = ?",
                timeout: 40000,
                values: [params.user_id]
            }, (err, result) => {
                complement(err, result, callback, response, connection);
            });
        } else {
            connection.query( {
                sql: "SELECT a.id, a.title, a.summary, a.source, a.article_url, a.image_url, a.user_id, " +
                    "DATE_FORMAT(a.created_at, '%d/%d/%Y %H:%i:%S')  as created," +
                    "DATE_FORMAT(a.updated_at, '%d/%d/%Y %H:%i:%S') as updated " +
                    "FROM articles a inner " +
                    "JOIN users u ON a.user_id = u.id " +
                    " where u.role = 'ROLE_ADMIN' order by a.updated_at desc",
                timeout: 40000
            }, (err, result) => {
                complement(err, result, callback, response, connection);
            });
        }
    });
}

function complement(err, result, callback, response, connection) {

    connection.release();

    if (err) {
        response.status = 401; // 401 = Unauthorized
        response.message = err.message;
        return callback(response);
    }

    if (result.length === 0 ) {
        // User not found
        response.status = 404; // 404 = Not found
        response.message = "Articles not found";
        return callback(response);
    } else {
        // User found
        response.status = 200; // 0 = Success
        response.message = "Articles found";
        response.articles = result;
        return callback(null, response);
    }
}

//--------------------------------------------------------
//TODO - REFACTOR with getUser
function deleteBy(article_id, callback) {
    const response = {
        status: 500, // 500 = Internal Server Error
        message: 'Error connecting to database',
        article: null,
    };
    // Getting connection from pool
    database.pool.getConnection((err, connection) => {
        if (err) {
            return callback(response);
        }

        connection.query({
            sql: 'DELETE FROM articles WHERE id = ?',
            timeout: 40000, // 40s
            values: [article_id]
        }, (err, result) => {
            connection.release();
            if (err) {
                response.status = 401; // 404 = Not found
                response.message = err.message;
                return callback(response);
            }

            if ( result.affectedRows === 0 ) {
                response.status = 404; // 404 = Not found
                response.message = 'Article not found';
                return callback(response);
            } else {
                response.status = 200;
                response.message = 'Article deleted successfully';
                return callback(null, response);
            }
        });
    });
}

// TODO - verify soon
function findAll(callback) {
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
function deleteAll(callback) {
    const response = {
        status: 500, // 500 = Internal Server Error
        message: 'Error connecting to database',
        article: null,
    };

    database.pool.getConnection((err, connection) => {
        if (err) {
            return callback(response);
        }

        connection.query({
            sql: 'delete from articles',
            timeout: 40000, // 40s
        }, (err, result) => {
            connection.release();
            if (err) {
                response.status = 401; // 404 = Not found
                response.message = err.message;
                return callback(response);
            }

            if ( result.affectedRows === 0 ) {
                response.status = 404; // 404 = Not found
                response.message = 'Article table is already empty';
                return callback(response);
            } else {
                response.status = 200;
                response.message = 'Articles deleted successfully';
                return callback(null, response);
            }
        });
    });
}

module.exports = {
    findBy,
    find,
    findAll,
    create,
    update,
    deleteBy,
    deleteAll
}
