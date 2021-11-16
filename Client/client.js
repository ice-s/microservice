const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = "./client.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});
const NoteService = grpc.loadPackageDefinition(packageDefinition).NoteService;

const client = new NoteService('localhost:50051', grpc.credentials.createInsecure());

module.exports = client;