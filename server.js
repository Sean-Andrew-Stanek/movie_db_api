//Modules
const express = require('express');
const path = require('path');
const MovieModel = require('.models/movie.model');
const DirectorModel = require('.models/director.model');
const GenreModel = require('.model/genre.model');
const Genre = require('./models/genre.model');

//Express Setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true }));

//Collections
const Movies = MovieModel.Movie;
const Directors = DirectorModel.Director;
const Genres = GenreModel.User;


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
app.get('/movie/all', async(req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
        });
});

//Get all directors
app.get('/director/all', async(req, res) => {
    await Directors.find()
        .then((directors) => {
            res.status(201).json(directors);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
        });
});

//Get all genres
app.get('/genre/all', async(req, res) => {
    await Genres.find()
        .then((genres) => {
            res.status(201).json(genres);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
        });
});

//POST: Add movie to database
//////////////////
////
////    Body Requirement:
////    "title": <movie_title>.required
////    "description": <movie_description>.required
////    "directorName": <director_name>.required
////    "genreName": <genre_name>.required
////
////    Optional:
////    ---Movie---
////    "image": <movie_image>
////    "actors": <movie_actors>
////
//////////////////

app.post('/movie', async(req, res) => {
    try{

        //Testing Required Fields
        if(!req.body.description || !req.body.title)
            return res.status(400).send('Add the description or title for the movie.');
        else if(!req.body.directorName)
            return res.status(400).send('No director name found');
        else if(!req.body.genreName)
            return res.status(400).send('No genre given');

        //Validating the fields

        //Duplicate Movie.description 
        const foundMovie = await Movies.findOne( {description: req.body.description} );
        if(foundMovie){
            return res.status(400).send(req.body.title + ' already exists based on the description');
        }
        
        // Find the director
        let director = await Directors.findOne( {name: req.body.directorName});
        // Creates a black director if one is not found.
        if(!director)
        {
            try{
                Directors.create({
                    name: req.body.directorName
                });
            }catch(error) {
                console.error(error);
                res.status(500).send('Error: ' + error);
            }
        }

        //Find the genre
        let genre = await Genre.findOne( {name: req.body.genreName});
        // Creates a black genre if one is not found.
        if(!genre)
        {
            try{
                Genres.create({
                    name: req.body.genreName
                });
            }catch(error) {
                console.error(error);
                res.status(500).send('Error: ' + error);
            }
        }

        // Using the above and passing all tests,
        // we create the new entry
        const newMovieData = {
            title: req.body.title,
            description: req.body.description,
            director: director._id,
            genre: genre._id
        };

        //Optional fields
        if(req.body.actors)
            newMovieData.actors = req.body.actors;
        if(req.body.image)
            newMovieData.image = req.body.image;

        //Create the new field
        const newMovie = await Movies.create(newMovieData);

        //Return the new object
        res.status(201).json(newMovie);
    } catch (error) {
        console.error('Error creating movie: ', error);
        res.status(500).send('Internal Server Error');
    }

});

//POST: Add director to database
//////////////////
////
////    Body Requirement:
////    "name": <director_name>.required
////
////    Optional:
////    "bio": <director_bio>
////    "birth": <director_birth>
////    "death": <director_death>
////    "image": <director_image>
////
//////////////////

app.post('/director', async(req, res) => {
    res.status(501).send('Not implemented yet');
});

//POST: Add genre to database
//////////////////
////
////    Body Requirement:
////    "name": <genre_name>.required
////
////    Optional:
////    "description": <director_description>
////    "image": <director_image>
////
//////////////////

app.post('/genre', async(req, res) => {
    res.status(501).send('Not implemented yet');
});

//PUT:  Update movie
app.put('/movie/:movieId', async(req, res) => {
    res.status(501).send('Not implemented yet');
});

//PUT:  Update director
app.put('/director/:directorId', async(req, res) => {
    res.status(501).send('Not implemented yet');
});

//PUT:  Update genre
app.put('/genre/:genreId', async(req, res) => {
    res.status(501).send('Not implemented yet');
});

//DELETE: Delete genre
app.delete('/movie/:movieId', async(req, res) => {
    res.status(501).send('Not implemented yet');
});

//DELETE:  Delete director
app.delete('/director/:directorId', async(req, res) => {
    res.status(501).send('Not implemented yet');
});

//DELETE:  Delete genre
app.delete('/genre/:genreId', async(req, res) => {
    res.status(501).send('Not implemented yet');
});