const chai = require('chai');
const chai_Http =require('chai-http')
const app = require('../app');
const {deleteDatabase} = require("../bin/controller/userController");
chai.should()
chai.use(chai_Http)

describe('User', () => {

    before(async (done) => {
        deleteDatabase();
        done()
    });

    let user_id = "";

    it('GET /users - return message ', (done) => {
        chai.request(app)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.eql('respond with a resource')
                done();
            });
    });

    it('POST /users/register it should  POST create a new User', (done) => {
        let user =
            {
                user: {
                    name: "user3",
                    email: "user3@user.com",
                    password: "user"
                }
            }
        chai.request(app)
            .post('/users/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.a.json;
                res.should.have.status(201);
                res.body.should.have.property('user_id');
                user_id = res.body.user_id
                done();
            });
    });

    it('POST /users/register - it return error because of duplicate email', (done) => {
        let user =
            {
                user: {
                    name: "user4",
                    email: "user3@user.com",
                    password: "user"
                }
            }
        chai.request(app)
            .post('/users/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('user_id')
                res.body.should.have.property('message')
                done();
            });
    });

    it('POST /users/register - it return error because of missing email', (done) => {
        let user =
            {
                user: {
                    name: "user4",
                    email: "",
                    password: "user"
                }
            }
        chai.request(app)
            .post('/users/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message').eql('User name, email or password is empty')
                done();
            });
    });

    it('POST /users/logout - it should  POST Log out error status 304 because cookies not found', (done) => {
        chai.request(app)
            .post('/users/logout')
            .end((err, res) => {
                res.should.have.status(304);
                done();
            });
    });

    it('POST /users/profile - it should  return an error status 304 because cookies not found', (done) => {
        chai.request(app)
            .post('/users/profile')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    it('POST /users/login - it should  POST Log in the user', (done) => {
        let user = {
            user: {
                password: "user",
                email: "user3@user.com",
            }
        }
        chai.request(app)
            .post('/users/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a.json
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                done();
            });
    });

    it('POST /users/login - it should  email or password incorrect', (done) => {
        let user = {
            user: {
                password: "user",
                email: "user654654@user.com",
            }
        }
        chai.request(app)
            .post('/users/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('message').eql('username or password not corret')
                done();
            });
    });

    it('DELETE /users/delete - it deletes user and return status 200', (done) => {
        chai.request(app)
            .delete('/users/delete')
            .send({user_id})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message').eql('User deleted successfully')
                done();
            });
    });

    it('DELETE /users/delete - it return 404 because user_id doesn\'t exist', (done) => {
        chai.request(app)
            .delete('/users/delete')
            .send({user_id: '5c9f'})
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('message').eql('User not found')
                done();
            });
    });

    after(async (done) => {
        deleteDatabase();
        done()
    });
})
