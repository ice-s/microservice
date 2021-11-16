const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = "./notes.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
// const notesProto = grpc.load('notes.proto');
const notesProto = grpc.loadPackageDefinition(packageDefinition);

const client = new notesProto.NoteService('localhost:50051', grpc.credentials.createInsecure());

module.exports = client;