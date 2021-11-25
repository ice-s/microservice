const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const UserRPCClient = require('../src/RPCClient/user');

app.post("/api/auth/login", (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    UserRPCClient.auth({'username': req.body.username, 'password': req.body.password}, (error, user) => {
        if (!error) {
            res.end(JSON.stringify(
                {
                    'status': true,
                    'user': user,
                    'token': jwt.sign(user, 'shhhhh'),
                    'message': 'call Remote Procedure to User Service to get User check credential',
                }
            ));
        } else {
            res.end(JSON.stringify(
                {
                    'status': false,
                    'request': {'username': req.body.username, 'password': req.body.password},
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