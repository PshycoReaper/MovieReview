const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const puerto = 3500;

const MONGO_URL = 'mongodb://Guille:ulhL9b4Fa1ueEHl3@ac-jhsqbwj-shard-00-00.clrdywj.mongodb.net:27017,ac-jhsqbwj-shard-00-01.clrdywj.mongodb.net:27017,ac-jhsqbwj-shard-00-02.clrdywj.mongodb.net:27017/MovieReviewDB?ssl=true&replicaSet=atlas-zcac6m-shard-0&authSource=admin&appName=MovieReview'

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'))

})

mongoose.connect(MONGO_URL).then(() => console.log('Conexión realizada')).catch(err => console.error('Al menos lo intentaste', err))

app.listen(puerto, () => {
    console.log(`Servidor activo en http:localhost:${puerto}`)
})

//============
// DATA MODELS
//============

/*
names of de collections
admin
reviews
users
*/
const admin = mongoose.model('admin', new mongoose.Schema({
    id: Number,
    userName: string,
    email: string,
    password: string
}))


//==============
//API ENDPOINTS
//==============

