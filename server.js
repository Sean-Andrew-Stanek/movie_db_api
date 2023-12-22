//Modules
const express = require('express');
const path = require('path');
const MovieModel = require('.models/movie.model');
const DirectorModel = require('.models/director.model');
const GenreModel = require('.model/genre.model');
const Genre = require('./models/genre.model');
const mongoose = require('mongoose');

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

mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

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
    try {

        if(!req.body.name)
            res.status(400).send('A director needs a name.');

        // Check for a director
        let director = await Directors.findOne( {name: req.body.name});
        if(director)
        {
            res.status(400).send('Director already exists');
        }

        try{
            const newDirectorData = {
                name: req.body.name
            };

            if(req.body.bio)
                newDirectorData.bio = req.body.bio;
            if(req.body.birth)
                newDirectorData.birth = req.body.birth;
            if(req.body.death)
                newDirectorData.death = req.body.death;
            if(req.body.image)
                newDirectorData.image = req.body.image;

            //Create the new field
            const newDirector = await Movies.create(newDirectorData);

            //Return the new object
            res.status(201).json(newDirector);

        }catch(error) {
            console.error(error);
            res.status(500).send('Error: ' + error);
        }
        
    } catch (error) {
        console.error('Error creating director: ', error);
        res.status(500).send('Internal Server Error');
    }
});

//POST: Add genre to database
//////////////////
////
////    Body Requirement:
////    "name": <genre_name>.required
////
////    Optional:
////    "description": <genre_description>
////    "image": <genre_image>
////
//////////////////
app.post('/genre', async(req, res) => {
    try {

        if(!req.body.name)
            res.status(400).send('A genre needs a name.');

        // Check for a director
        let genre = await Genres.findOne( {name: req.body.name});
        if(genre)
        {
            res.status(400).send('Director already exists');
        }

        try{
            const newGenreData = {
                name: req.body.name
            };

            if(req.body.bio)
                newGenreData.bio = req.body.bio;
            if(req.body.birth)
                newGenreData.birth = req.body.birth;
            if(req.body.death)
                newGenreData.death = req.body.death;
            if(req.body.image)
                newGenreData.image = req.body.image;

            //Create the new field
            const newGenre = await Movies.create(newGenreData);

            //Return the new object
            res.status(201).json(newGenre);

        }catch(error) {
            console.error(error);
            res.status(500).send('Error: ' + error);
        }
        
    } catch (error) {
        console.error('Error creating genre: ', error);
        res.status(500).send('Internal Server Error');
    }
});

//PUT:  Update movie
//////////////////
////
////    Required:
////    "_id": <movie_id>
////
////    Updatables:
////    "title": <movie_title>
////    "description": <movie_description>
////    "image": <movie_image>
////    "actors": <movie_actors>
////
//////////////////
app.put('/movie/:movieId', async(req, res) => {
    
    await Movies.findByID(req.params.id)
        .then(async(movie) => {
          
            if(movie) {
                if(!req.body.title && !req.body.description && !req.body.image && !req.body.actors){
                    res.status(400).send('No updateable fields found');
                }else{
                    let updatedFields = [];

                    if(req.body.title){
                        await Movies.findByIdAndUpdate(req.params.id, {title: req.params.title});
                        updatedFields.push('title');
                    }

                    if(req.body.description){
                        await Movies.findByIdAndUpdate(req.params.id, {description: req.body.description});
                        updatedFields.push('description');
                    }

                    if(req.body.image){
                        await Movies.findByIdAndUpdate(req.params.id, {image: req.body.image});
                        updatedFields.push('image');
                    }

                    if(req.body.actors){
                        await Movies.findByIdAndUpdate(req.params.id, {actors: req.body.actors});
                        updatedFields.push('actors');
                    }

                    console.log('updated: ' + updatedFields);

                    res.status(200).json(await Movies.findById(req.params.id));

                }
            } else {
                res.status(400).send('Movie was not found');
            }
        }).catch((error) => {
            console.error('Error creating genre: ', error);
            res.status(500).send('Internal Server Error');
        });

});

//PUT:  Update director
//////////////////
////
////    Body Requirement:
////    "_id": <director_id>
////
////    Optional:
////    "name": <director_name>
////    "bio": <director_bio>
////    "birth": <director_birth>
////    "death": <director_death>
////    "image": <director_image>
////
////
//////////////////
app.put('/director/:directorId', async(req, res) => {
    
    await Directors.findByID(req.params.id)
        .then(async(director) => {
          
            if(director) {
                if(!req.body.name && !req.body.bio && !req.body.birth && !req.body.death && !req.body.image){
                    res.status(400).send('No updateable fields found');
                }else{
                    let updatedFields = [];

                    if(req.body.name){
                        await Directors.findByIdAndUpdate(req.params.id, {name: req.params.name});
                        updatedFields.push('name');
                    }

                    if(req.body.bio){
                        await Directors.findByIdAndUpdate(req.params.id, {bio: req.body.bio});
                        updatedFields.push('bio');
                    }

                    if(req.body.birth){
                        await Directors.findByIdAndUpdate(req.params.id, {birth: req.body.birth});
                        updatedFields.push('birth');
                    }

                    if(req.body.death){
                        await Directors.findByIdAndUpdate(req.params.id, {death: req.body.death});
                        updatedFields.push('death');
                    }

                    if(req.body.image){
                        await Directors.findByIdAndUpdate(req.params.id, {image: req.body.image});
                        updatedFields.push('image');
                    }
                    
                    console.log('updated: ' + updatedFields);

                    res.status(200).json(await Directors.findById(req.params.id));
                }
            } else {
                res.status(400).send('Director was not found.');
            }
        }).catch((error) => {
            console.error('Error creating genre: ', error);
            res.status(500).send('Internal Server Error');
        });

});

//PUT:  Update genre
//////////////////
////
////    Body Requirement:
////    "id": <genre_id>
////
////    Optional:
////    "name": <genre_name>
////    "description": <genre_description>
////    "image": <genre_image>
////
////
//////////////////
app.put('/genre/:genreId', async(req, res) => {
    
    await Genres.findByID(req.params.id)
        .then(async(genre) => {
          
            if(genre) {
                if(!req.body.name && !req.body.description && !req.body.image){
                    res.status(400).send('No updateable fields found');
                }else{
                    let updatedFields = [];

                    if(req.body.name){
                        await Genres.findByIdAndUpdate(req.params.id, {name: req.params.name});
                        updatedFields.push('name');
                    }

                    if(req.body.description){
                        await Genres.findByIdAndUpdate(req.params.id, {bio: req.body.description});
                        updatedFields.push('description');
                    }

                    if(req.body.image){
                        await Genres.findByIdAndUpdate(req.params.id, {birth: req.body.image});
                        updatedFields.push('image');
                    }
                    
                    console.log('updated: ' + updatedFields);

                    res.status(200).json(await Genres.findById(req.params.id));
                }
            } else {
                res.status(400).send('Genre was not found.');
            }
        }).catch((error) => {
            console.error('Error creating genre: ', error);
            res.status(500).send('Internal Server Error');
        });

});

//DELETE: Delete genre
app.delete('/movie/:movieId', async(req, res) => {

    await Movies.findByIdAndRemove(req.params.id)
        .then((movie) => {
            if(movie){
                res.status(200).send('Movies Deleted');
            }else{
                res.status(400).send('Movie Not Found');
            }
        }).catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
        });

});

//DELETE:  Delete director
app.delete('/director/:directorId', async(req, res) => {
    
    await Directors.findByIdAndRemove(req.params.id)
        .then((director) => {
            if(director){
                res.status(200).send('Director Deleted');
            }else{
                res.status(400).send('Director Not Found');
            }
        }).catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
        });

});

//DELETE:  Delete genre
app.delete('/genre/:genreId', async(req, res) => {

    await Genres.findByIdAndRemove(req.params.id)
        .then((genre) => {
            if(genre){
                res.status(200).send('Genre Deleted');
            }else{
                res.status(400).send('Genre Not Found');
            }
        }).catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
        });

});

const port = process.env.PORT || serverPort;

app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on Port: ${port}`);
});