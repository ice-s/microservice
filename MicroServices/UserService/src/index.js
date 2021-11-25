/**
 * RPC Server
 */
const RPCPort = process.env.RPC_PORT || 50000;
const RpcServer = require('./RPCServer/server').RpcServer;
RpcServer.init(RPCPort);
RpcServer.start();

/**
 * REST API Server
 */
const API_PORT = process.env.API_PORT || 3000;
const RestServer = require('./RestServer/server').RestServer;
RestServer.init(API_PORT);
RestServer.start();