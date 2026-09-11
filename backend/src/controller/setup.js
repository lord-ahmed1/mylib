const cors = require('cors');
const session=require('express-session');
const express = require('express');
const bodyParser=require('body-parser');
const {setupPassportWithApp}=require('../middleware/auth');

function setupApp(app){
    app.use(cors({
        origin: '*', // Works with JWT since tokens are sent in headers, not cookies
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 14 
        }
    }));
    app.use(bodyParser.urlencoded({'extended':true}))
    setupPassportWithApp(app)
}

module.exports=setupApp