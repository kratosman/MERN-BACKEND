const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const PostRouter = require('./router/PostRouter')
const Auth = require('./router/Auth')

app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use('/api/callback', PostRouter)
app.use('/auth', Auth)

mongoose.connect('mongodb+srv://twittermern123:twittermern123@cluster0.4itoc.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        app.listen(3006, () => {
            console.log('app listening to port http://localhost:3006')
        })
    })
