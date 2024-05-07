const mongoose = require('mongoose');

//Create a schema
const candidateschema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    party: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: true
            },
            VotedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    VoteCount: {
        type: Number,
        default: 0
    }
})
//Create a model of person
const Candidate = mongoose.model('candidate', candidateschema);
module.exports = Candidate;