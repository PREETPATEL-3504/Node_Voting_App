const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


//Create a schema
const userschema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    mobile: {
        type: Number,
        require: true,
        unique: true
    },
    email: {
        type: String
    },
    address: {
        type: String,
        require: true
    },
    aadharcardnumber: {
        type: Number,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['voter','admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
})

//For Password 
userschema.pre('save', async function (next) {
    const person = this;

    if (!person.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hasepassword = await bcrypt.hash(person.password, salt);
        person.password = hasepassword;
        next();
    } catch (err) {
        return next(err);
    }
})

userschema.methods.comparepassword = async function (candidatePassword) {
    try {
        const ismatch = await bcrypt.compare(candidatePassword, this.password);
        return ismatch
    } catch (error) {
        console.log("Error")
    }
}

//Create a model of person
const user = mongoose.model('user', userschema);

module.exports = user;


