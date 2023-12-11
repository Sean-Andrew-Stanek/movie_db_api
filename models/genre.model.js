const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true}
});

genreSchema.virtual('movies', {
    ref: 'Movie',
    localField: '_id',
    foreignField: 'genre',
    justOne: false
});

// Virtuals will be included when converting to JSON
genreSchema.set('toObject', {virtuals: true});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;