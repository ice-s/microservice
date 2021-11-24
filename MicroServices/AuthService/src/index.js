const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const express = require("express");
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

mongoClient.connect('mongodb://mongo:27017', function (err, db) {
    if (err) throw err;
    console.log('Mongo connected');
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post("/api/auth/login", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(
        {
            'status': true,
            'token': jwt.sign({ foo: 'bar' }, 'shhhhh'),
            'message': 'call Remote Procedure to User Service to get User check credential',
        }
    ));
});

app.post("/api/auth/register", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(
        {
            'status': true,
            'data': req.body,
            'message': 'call Remote Procedure to User Service to Register User',
        }
    ));
});

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
    console.log("Server API running at port %d", PORT);
});