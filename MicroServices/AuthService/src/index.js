const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const express = require("express");
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const http = require("http");

mongoClient.connect('mongodb://mongo:27017', function (err, db) {
    if (err) throw err;
    console.log('Mongo connected');
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const UserRPCClient = require('../src/RPCClient/user');

app.post("/api/auth/login", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var options = {
        host: 'user',
        port: 3000,
        path: '/api/users',
        method: 'GET'
    };

    http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    }).end();

    UserRPCClient.auth({username: req.body.username, password: req.body.password}, (error, user) => {
        if (!error) {
            res.end(JSON.stringify(
                {
                    'status': true,
                    'user': user,
                    'token': jwt.sign({foo: 'bar'}, 'shhhhh'),
                    'message': 'call Remote Procedure to User Service to get User check credential',
                }
            ));
        } else {
            res.end(JSON.stringify(
                {
                    'status': false,
                    'data': {},
                    'message': error,
                }
            ));
        }
    });
});

app.post("/api/auth/register", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(
        {
            'status': true,
            'data': req.body,
            'message': 'Call Remote Procedure to User Service to register user',
        }
    ));
});

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
    console.log("Server API running at port %d", PORT);
});