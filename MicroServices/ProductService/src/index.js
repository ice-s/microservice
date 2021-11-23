const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const MongoConnectEndpoint = "mongodb://root:root@mongo:27017/";
const DB_NAME = "ProductDB";
const ObjectId = require('mongodb').ObjectID;
// const connection = new MongoClient('mongodb://mongo:27017/userDB', { useUnifiedTopology: true });

let packageDefinition = protoLoader.loadSync('users.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});
const Proto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

server.addService(Proto.UserService.service, {
    list: (_, callback) => {
        callback(null, {resources})
    },
    get: (call, callback) => {
        let user = resources.find((n) => n.id == call.request.id);
        if (user) {
            callback(null, user)
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            })
        }
    },
});

server.bind('127.0.0.1:50052', grpc.ServerCredentials.createInsecure());
console.log('Server RPC running at http://127.0.0.1:50052');
server.start();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/api/products", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(MongoConnectEndpoint, function (err, db) {
        if (err) throw err;
        let dbo = db.db(DB_NAME);
        let page = req.query.page? parseInt(req.query.page) : 1;
        dbo.collection("products").find({}).limit(10).skip((page-1)*10).toArray(function (err, result) {
            db.close();

            if (err) {
                res.end(JSON.stringify({'status': false, 'message': 'connection problem, retry again'}));
            }

            res.end(JSON.stringify({'status': true, 'data': result}));
        });
    });
});

app.get("/api/products/create", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(MongoConnectEndpoint, function (err, db) {
        if (err) throw err;
        let dbo = db.db(DB_NAME);
        let myobj = { name: 'p'+ Math.floor(Math.random() * 10000), price: Math.floor(Math.random() * 1000) };
        dbo.collection("products").insertOne(myobj, function(err, result) {
            if (err) {
                res.end(JSON.stringify({'status': false, 'message': 'connection problem, retry again'}));
            }

            res.end(JSON.stringify({'status': true, 'data': result}));
            db.close();
        });
    });
});

app.get("/api/products/:id", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(MongoConnectEndpoint, function (err, db) {
        if (err) throw err;
        let dbo = db.db(DB_NAME);
        dbo.collection("products").findOne({'_id':  new ObjectId(req.params.id)}, function (err, result) {
            db.close();
            if (err) {
                res.end(JSON.stringify({'status': false, 'message': 'connection problem, retry again'}));
            }

            res.end(JSON.stringify({'status': true, 'data': result}));
        });
    });
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
    console.log("Server API running at port %d", PORT);
});