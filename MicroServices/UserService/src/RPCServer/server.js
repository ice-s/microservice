const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const MongoConnectEndpoint = "mongodb://root:root@mongo:27017/";
const DB_NAME = "UserDB";
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

let packageDefinition = protoLoader.loadSync('src/Proto/app.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const Proto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

let RpcServer = {
    port: 50000,
    init: function (port) {
        if (port) {
            this.port = port;
        }
        server.addService(Proto.UserService.service, {
            list: (_, callback) => {
                callback(null, {})
            },
            get: (call, callback) => {
                let id = call.request._id;
                MongoClient.connect(MongoConnectEndpoint, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db(DB_NAME);
                    dbo.collection("users").findOne({'_id': new ObjectId(id)}, function (err, result) {
                        db.close();
                        if (!err) {
                            callback(null, result)
                        }

                        callback({
                            code: grpc.status.NOT_FOUND,
                            details: "Not found",
                            request: {'username': username, 'password': password},
                            error: err
                        })
                    });
                });
            },

            auth: (call, callback) => {
                let username = call.request.username;
                let password = call.request.password;
                MongoClient.connect(MongoConnectEndpoint, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db(DB_NAME);
                    dbo.collection("users").findOne({'username': username, 'password': password}, function (err, result) {
                        db.close();

                        if (!err) {
                            callback(null, result);
                            return;
                        }

                        callback({
                            code: grpc.status.NOT_FOUND,
                            details: "Not found",
                            error: err
                        })
                    });
                });
            }
        });
    },
    server: function () {
        return server;
    },
    start: function () {
        server.bind('0.0.0.0:' + this.port, grpc.ServerCredentials.createInsecure());
        console.log("Server RPC running at port %d", this.port);
        server.start();
    }
};

module.exports = {
    RpcServer: RpcServer,
};