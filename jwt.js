var jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtAuthmiddelware = (req, res, next) => {

    //first check request header has authorization or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'Token not found'});

    //Extract JWT Token from the request header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorozed' });

    try {
        //verify the JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Attach user information to the request object 
        req.user = decoded
        next();
    } catch (error) {
        res.status(401).json({ error: 'Ivnvalid Token' })
    }
}

//Function to generate JWT Token

const generateToken = (userData) =>{
    //Generate new JET Token using user data
    return jwt.sign(userData, process.env.JWT_SECRET);
}

module.exports = {jwtAuthmiddelware, generateToken}