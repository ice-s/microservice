const NoteClient = require("./client");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/notes", (req, res) => {
    NoteClient.list(null, (err, data) => {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        }
    });
});

app.get("/api/notes/:id", (req, res) => {
    NoteClient.get({id : req.params.id}, (err, data) => {
        res.setHeader('Content-Type', 'application/json');
        if (!err) {
            res.end(JSON.stringify(data));
        }

        res.end(JSON.stringify(err));
    });
});
//
// app.post("/save", (req, res) => {
//     let newCustomer = {
//         name: req.body.name,
//         age: req.body.age,
//         address: req.body.address
//     };
//
//     client.insert(newCustomer, (err, data) => {
//         if (err) throw err;
//
//         console.log("Customer created successfully", data);
//         res.redirect("/");
//     });
// });
//
// app.post("/update", (req, res) => {
//     const updateCustomer = {
//         id: req.body.id,
//         name: req.body.name,
//         age: req.body.age,
//         address: req.body.address
//     };
//
//     client.update(updateCustomer, (err, data) => {
//         if (err) throw err;
//
//         console.log("Customer updated successfully", data);
//         res.redirect("/");
//     });
// });
//
// app.post("/remove", (req, res) => {
//     client.remove({ id: req.body.customer_id }, (err, _) => {
//         if (err) throw err;
//
//         console.log("Customer removed successfully");
//         res.redirect("/");
//     });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running at port %d", PORT);
});