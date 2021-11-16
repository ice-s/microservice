const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = "./notes.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});
const UserService = grpc.loadPackageDefinition(packageDefinition).UserService;

const client = new UserService('localhost:50052', grpc.credentials.createInsecure());

module.exports = client;