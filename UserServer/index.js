const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const {v4: uuidv4} = require('uuid');

var packageDefinition = protoLoader.loadSync('users.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});
const usersProto = grpc.loadPackageDefinition(packageDefinition);

const users = [
    {id: '1', name: 'User 1', email: 'mail1@test.io'},
    {id: '2', name: 'User 2', email: 'mail2@test.io'},
    {id: '3', name: 'User 3', email: 'mail3@test.io'},
    {id: '4', name: 'User 4', email: 'mail4@test.io'},
    {id: '5', name: 'User 5', email: 'mail5@test.io'}
];
const server = new grpc.Server();

server.addService(usersProto.UserService.service, {
    list: (_, callback) => {
        callback(null, {users})
    },
    get: (call, callback) => {
        let user = users.find((n) => n.id == call.request.id);
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
console.log('Server running at http://127.0.0.1:50052');
server.start();