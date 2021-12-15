const express = require('express');
const router = express.Router();
const  { Issuer, generators}  = require('openid-client');
const {registerGoogle, getUserBy, getUserByEmail, checkUser} = require("../bin/controller/userController");
const jwt = require("jsonwebtoken");

// TODO - to optimize - For session
var ss = null

/* GET users listing. */
router.get('/google',  async function(req, res, next) {
    const googleIssuer = await Issuer.discover('https://accounts.google.com');
    const client = new googleIssuer.Client({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uris: [process.env.GOOGLE_REDIRECT_URI],
    });
    const code_verifier = generators.codeVerifier()
    const code_challenge = generators.codeChallenge(code_verifier);
    const  redirect_url = client.authorizationUrl({
        scope: 'openid email profile',
        resource: process.env.GOOGLE_REDIRECT_URI,
        code_challenge,
        code_challenge_method: 'S256',
    });
    ss = req.session;
    ss.code_verifier = code_verifier;
    res.cookie('code_verify', code_verifier).redirect(redirect_url);
});

/* GET users listing. */
router.get('/google/code', async function(req, res, next) {

    const googleIssuer = await Issuer.discover('https://accounts.google.com');
    googleIssuer.metadata.authorization_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    const client = new googleIssuer.Client({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uris: [process.env.GOOGLE_REDIRECT_URI],
    });

    const params = client.callbackParams(req);
    const code_verifier = ss.code_verifier
    //TODO - to delete ss.code_verifier => security
    try {
        const tokenSet = await client.callback(process.env.GOOGLE_REDIRECT_URI, params, { code_verifier });
        const user = {
            auth_id: tokenSet.claims().sub,
            email: tokenSet.claims().email,
            name: tokenSet.claims().name,
            is_active: tokenSet.claims().email_verified,
        }

        // TODO - refactor
        const callback_login = (error, data) => {
            if (error) {
                // TODO - make redirect to register user
                // else Register this user
                registerGoogle(user, callback_register)
            } else {
                const payload = {
                    id: data.user.id,
                    email: data.user.email,
                    role: data.user.role,
                }
                //TODO -to remove expiresIn
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
                // User already exist
                res.cookie('token', token, { httpOnly: true })
                    .send({ message: "Logged in successfully"});
            }
        }

        const callback_register = (error, data) => {
            if (error) {
                res.status(error.status).send({
                    message: error.message,
                    status: error.status,
                });
            } else {
                res.cookie('token', tokenSet.claims().access_token, { httpOnly: true })
                    .send({ message: "Register and Logged in successfully"});
            }
        }

        // TODO - have to verify if user is already registered
        // then Log In this user
        getUserByEmail(user.email, callback_login);
    } catch (e) {
        res.status(401).send({error: 'No code provided : ' + e.message});
    }
});

/* GET users listing. */
router.get('/google/token', async function(req, res, next) {
    if (!req) {
        return res.status(401).send({error: 'No code provided'});
    }
    const token = "token";
    //Set token in cookie
    // TODO - to activate secure and domain
    res.cookie('token', token, { httpOnly: true })
        .send({ message: "Log in successfully"});
});

/* GET users listing. */
router.get('/google/callback', async function(req, res, next) {
    const user = checkUser(req);
    if (!user) {
        return res.status(401).send({error: 'No token provided'});
    }
    res.status(200).send({ user: {
        id: user.id,
        email: user.email,
        role: user.role,
    }});
});

module.exports = router;

