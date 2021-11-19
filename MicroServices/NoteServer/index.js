const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');
const PROTO_PATH = "./notes.proto";
const UserClient = require("./client");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});
const notesProto = grpc.loadPackageDefinition(packageDefinition);

const notes = [
    { id: '1', title: 'Note 1', content: 'Content 1', user_id : 1},
    { id: '2', title: 'Note 2', content: 'Content 2', user_id : 2},
    { id: '3', title: 'Note 3', content: 'Content 3', user_id : 3},
    { id: '4', title: 'Note 4', content: 'Content 4', user_id : 4},
];
const server = new grpc.Server();

server.addService(notesProto.NoteService.service, {
    list: (_, callback) => {
        callback(null, {notes})
    },
    get: (call, callback) => {
        let note = notes.find((n) => n.id == call.request.id);
        if (note) {
            UserClient.get({ id: note.user_id }, (error, user) => {
                if (!error) {
                    note.user = user;
                    callback(null, note)
                } else {
                    callback(null, {})
                }
            });
        } else {
            // callback(null, {});
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            }, {})
        }
    },
    insert: (call, callback) => {
        let note = call.request;
        note.id = uuidv4();
        notes.push(note);
        callback(null, note)
    },
    update: (call, callback) => {
        let existingNote = notes.find((n) => n.id == call.request.id);
        if (existingNote) {
            existingNote.title = call.request.title;
            existingNote.content = call.request.content;
            callback(null, existingNote)
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            })
        }
    },
    delete: (call, callback) => {
        let existingNoteIndex = notes.findIndex((n) => n.id == call.request.id);
        if (existingNoteIndex !== -1) {
            notes.splice(existingNoteIndex, 1);
            callback(null, {})
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            })
        }
    }
});

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://127.0.0.1:50051');
server.start();