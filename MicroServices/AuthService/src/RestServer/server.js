const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const UserRPCClient = require('../RPCClient/user');

let RestServer = {
    port: 3000,
    init: function (port) {
        if (port) {
            this.port = port;
        }

        app.post("/api/auth/login", (req, res) => {
            res.setHeader('Content-Type', 'application/json');

            UserRPCClient.auth({'username': req.body.username, 'password': req.body.password}, (error, user) => {
                if (!error) {
                    res.end(JSON.stringify(
                        {
                            'status': true,
                            'token': jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                                data:  {
                                    _id : user._id,
                                    username : user.username
                                },
                            }, 'secret'),
                            'message': 'Call Remote Procedure to UserService check credential',
                        }
                    ));
                } else {
                    res.end(JSON.stringify(
                        {
                            'status': false,
                            'request': {'username': req.body.username, 'password': req.body.password},
                            'message': error,
                        }
                    ));
                }
            });
        });

        app.post("/api/auth/register", (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(
                {
                    'status': true,
                    'data': req.body,
                    'message': 'Call Remote Procedure to User Service to register user',
                }
            ));
        });
    },
    app: function () {
        return app;
    },
    start: function () {
        app.listen(this.port, () => {
            console.log("Server API running at port %d", this.port);
        });
    }
};

module.exports = {
    RestServer: RestServer,
};