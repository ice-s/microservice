const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const MongoConnectEndpoint = "mongodb://root:root@mongo:27017/";
const DB_NAME = "OrderDB";
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
        // server.addService(Proto.OrderService.service, {
        // });
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