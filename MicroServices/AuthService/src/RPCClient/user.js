const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = 'src/Proto/app.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});
const UserService = grpc.loadPackageDefinition(packageDefinition).UserService;

const RPC_PORT = process.env.RPC_USER_PORT || 50000;
const UserHost = process.env.RPC_USER_HOST || 'user';

const client = new UserService(UserHost+':'+RPC_PORT, grpc.credentials.createInsecure());

console.log('Create RCP User Client: ' + UserHost+':'+RPC_PORT);
module.exports = client;