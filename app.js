// app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();
const connection = require('./connection');


app.get('/', function(req, res) {
    res.status(200).json({ message: 'Hello World!' })
})

app.post('/bookmarks', function(req, res) {
    if (!req.body.url || !req.body.title) {
        return res.status(422).json({ "error": "required field(s) missing" });
    }
    const { url, title } = req.body;
    connection.query(
        "INSERT INTO bookmark(url, title) VALUES(?, ?)",
        [url, title],
        (err, results) => {
            if (err) res.sendStatus(500);
            connection.query(
                "SELECT * from bookmark WHERE id = ?",
                results.insertId,
                (err, results) => {
                    if (err) res.sendStatus(500);
                    res.status(201).json(results[0])
                }
            )
        }
    )
});

app.get('/bookmarks/:id', function(req, res) {
    connection.query(
        "SELECT * from bookmark WHERE id=?",
        req.params.id,
        (err, results) => {
            if (err) res.sendStatus(500);
            if (results.length === 0) res.status(404).json({ error: 'Bookmark not found' });
            res.status(200).json(results[0])
        }
    )
});

module.exports = app;
