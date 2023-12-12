//Modules
const express = require('express');
const path = require('path');
const MovieModel = require('.models/movie.model');
const DirectorModel = require('.models/director.model');
const GenreModel = require('.model/genre.model');

//Express Setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true }));

//Collections
const Movies = MovieModel.Movie;
const Directors = DirectorModel.Director;
const Users = GenreModel.User;


//CONSTANTS
let serverPort = 8080;


app.get('/documentation', (req, res) => {
    const filePath = path.join(process.cwd(), 'public/documentation.html');
    res.sendFile(filePath);
});

app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(serverPort, () => {
    console.log(`Server started on port ${serverPort}`);
});

////////////
//
//  Movie
//
////////////


//Get all movies
app.get('/movies', async(req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
        });
});

//Add movie
//app.post('/movies',)