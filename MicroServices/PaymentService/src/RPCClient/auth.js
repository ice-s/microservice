const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = 'src/Proto/app.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});
const AuthService = grpc.loadPackageDefinition(packageDefinition).AuthService;

const RPC_PORT = process.env.RPC_AUTH_PORT || 50000;
const AuthHost = process.env.RPC_AUTH_HOST || 'auth';

const client = new AuthService(AuthHost+':'+RPC_PORT, grpc.credentials.createInsecure());

console.log('Create RCP User Client: ' + AuthHost+':'+RPC_PORT);
module.exports = client;