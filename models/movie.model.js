const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director'
    },
    image: String,
});

//Add virtuals when converting to JSON
movieSchema.set('toObject', {virtuals: true});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;