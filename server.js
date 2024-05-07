const express = require('express')
const app = express()
const db = require('./db')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
require('dotenv').config()
// const { jwtAuthmiddelware } = require('./jwt')

const userRoutes = require('./routes/userroutes');
app.use('/user', userRoutes)

const candidateRoutes = require('./routes/candidateRoutes');
app.use('/candidate', candidateRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listing on ${port}`)
})