const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const db = require('knex')({
    client: 'pg',
    connection: {
      ssl: { rejectUnauthorized: false },
      host : process.env.DATABASE_HOST,
      port : 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }
  });

  



const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors())


app.get('/', (req, res) => {
    res.send('success');
})
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})
app.post('/register', (req,res) => { register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req,res) => { profile.handleProfile (req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

  

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`app is running on ${process.env.PORT}`)
})

