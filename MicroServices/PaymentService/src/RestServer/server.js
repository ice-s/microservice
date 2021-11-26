const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const MongoConnectEndpoint = "mongodb://root:root@mongo:27017/";
const DB_NAME = "OrderDB";
const ObjectId = require('mongodb').ObjectID;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const AuthRPCClient = require('../RPCClient/auth');


let RestServer = {
    port: 3000,
    init: function (port) {
        if (port) {
            this.port = port;
        }
        app.use(function (req, res, next) {
            const bearerHeader = req.headers['authorization'];
            if (bearerHeader) {
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
                AuthRPCClient.decode({'token': bearerToken}, (error, data) => {
                    if (!error) {
                        if(data.status === true){
                            req.token = bearerToken;
                            next();
                        } else{
                            res.sendStatus(403);
                            return false;
                            // res.setHeader('Content-Type', 'application/json');
                            // res.end(JSON.stringify({'status': false, 'code': 403, 'message' : data.message}));
                        }
                    } else {
                        res.sendStatus(403);
                        return false;
                        // res.setHeader('Content-Type', 'application/json');
                        // res.end(JSON.stringify({'status': false, 'code': 403, 'message' : 'Server error'}));
                    }
                });
            } else {
                res.sendStatus(403);
                return false;
                // res.setHeader('Content-Type', 'application/json');
                // res.end(JSON.stringify({'status': false, 'code': 403, 'message' : 'missing bearer token'}));
            }
        });

        app.get("/api/payments", (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            MongoClient.connect(MongoConnectEndpoint, function (err, db) {
                if (err) throw err;
                let dbo = db.db(DB_NAME);
                let page = req.query.page? parseInt(req.query.page) : 1;
                dbo.collection("payments").find({}).limit(10).skip((page-1)*10).toArray(function (err, result) {
                    db.close();

                    if (err) {
                        res.end(JSON.stringify({'status': false, 'message': 'connection problem, retry again'}));
                    }

                    res.end(JSON.stringify({'status': true, 'data': result}));
                });
            });
        });

        app.get("/api/payments/:id", (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            MongoClient.connect(MongoConnectEndpoint, function (err, db) {
                if (err) throw err;
                let dbo = db.db(DB_NAME);
                dbo.collection("payments").findOne({'_id':  new ObjectId(req.params.id)}, function (err, result) {
                    db.close();
                    if (err) {
                        res.end(JSON.stringify({'status': false, 'message': 'connection problem, retry again'}));
                    }

                    res.end(JSON.stringify({'status': true, 'data': result}));
                });
            });
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