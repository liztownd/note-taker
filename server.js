const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



app.get('/', (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

app.get('/api/notes', (req, res) => {

    let notes;

    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) throw err
        notes = JSON.parse(data)

        res.json(notes);

    })

});

app.post('/api/notes', (req, res) => {

    let notes;
    let newNote = req.body;
    newNote.id = uuidv4();
    console.log(newNote);

    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) throw err

        notes = JSON.parse(data);

        notes.push(newNote);
        console.log(notes)

        fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
            if (err) throw err

            res.json(notes);


        })


    })


})


app.delete('/api/notes/:id', (req, res) => {

    let notes;
    let deleteNote = req.params.id;

    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) throw err

        notes = JSON.parse(data);

        for (let i = 0; i < notes.length; i++ ) {
            if (notes[i].id === deleteNote){
                notes.splice(i, 1);
            }
        }


        fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
            if (err) throw err

            res.json(notes);


        })


    })


})


app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));
