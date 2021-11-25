const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const MongoConnectEndpoint = "mongodb://root:root@mongo:27017/";
const DB_NAME = "UserDB";
const ObjectId = require('mongodb').ObjectID;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let RestServer = {
    port: 3000,
    init: function (port) {
        if (port) {
            this.port = port;
        }

        app.get("/api/users", (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            MongoClient.connect(MongoConnectEndpoint, function (err, db) {
                if (err) throw err;
                let dbo = db.db(DB_NAME);
                let page = req.query.page ? parseInt(req.query.page) : 1;
                dbo.collection("users").find({}).limit(10).skip((page - 1) * 10).toArray(function (err, result) {
                    db.close();

                    if (err) {
                        res.end(JSON.stringify({'status': false, 'message': 'connection problem, retry again'}));
                    }

                    res.end(JSON.stringify({'status': true, 'data': result}));
                });
            });
        });

        app.get("/api/users/mock", (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            MongoClient.connect(MongoConnectEndpoint, function (err, db) {
                if (err) throw err;
                let dbo = db.db(DB_NAME);
                let myobj = {username: 'u' + Math.floor(Math.random() * 10000), password: "password"};
                dbo.collection("users").insertOne(myobj, function (err, result) {
                    if (err) {
                        res.end(JSON.stringify({'status': false, 'message': 'connection problem, retry again'}));
                    }

                    res.end(JSON.stringify({'status': true, 'data': result}));
                    db.close();
                });
            });
        });

        app.get("/api/users/:id", (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            MongoClient.connect(MongoConnectEndpoint, function (err, db) {
                if (err) throw err;
                let dbo = db.db(DB_NAME);
                dbo.collection("users").findOne({'_id': new ObjectId(req.params.id)}, function (err, result) {
                    db.close();
                    if (err) {
                        res.end(JSON.stringify({'status': false, 'message': 'connection problem, retry again'}));
                    }

                    res.end(JSON.stringify({'status': true, 'data': result}));
                });
            });
        });

        app.get("/api/users/create", (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({'status': true}));
        });
    },
    app: function () {
        return app;
    },
    start: function () {
        app.listen(this.port, () => {
            console.log("Server API running at port %d", this.port);
        });
    }
};

module.exports = {
    RestServer: RestServer,
};