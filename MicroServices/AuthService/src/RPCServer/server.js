const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const jwt = require("jsonwebtoken");

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
        server.addService(Proto.AuthService.service, {
            decode: (call, callback) => {
                let token = call.request.token;

                try {
                    let decoded = jwt.verify(token, 'secret');
                    callback(null, {
                        token: token,
                        status: true,
                        user: decoded.data
                    });

                } catch(err) {
                    if(err instanceof jwt.TokenExpiredError){
                        callback(null, {
                            token: token,
                            status: false,
                            message: 'Token expired'
                        });

                        return;
                    }

                    callback(null, {
                        token: token,
                        status: false,
                        message: 'Token invalid'
                    });
                }
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