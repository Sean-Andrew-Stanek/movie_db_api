const mongoose = require('mongoose');

const directorSchema = mongoose.Schema({
    name: {type: String, required: true},
    bio: {type: String, required: true},
    birth: {type: Date, required: true},
    death: Date,
    image: {type: String, required: true}
});

//Add movies to director
directorSchema.virtual('movies', {
    ref: 'Movie',
    localField: '_id',
    foreignField: 'director',
    justOne: false,
});

//Add virtuals when converting to JSON
directorSchema.set('toObject', {virtuals:true});

const Director = mongoose.model('Director', directorSchema);

module.exports = Director;