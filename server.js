const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'pure1337',
      database : 'face-detective'
    }
  });

  



const app = express();
app.use(bodyParser.json());
app.use(cors())


app.get('/', (req, res) => {
    res.send('success');
})

app.post('/signin', (req, res) => {
   db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
       return db.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
            res.json(user[0])
        })
        .catch(err => res.status(400).json('Error finding user'))
      } else {
        res.status(400).json('Invalid username or password')
      }
    })
    .catch(err => res.status(400).json('Invalid username or password.'))
})


app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    })
     .then(trx.commit)
     .catch(trx.rollback)
    })
   
    .catch(err => res.status(400).json('Error registering account, please try again!'))
})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user=> {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('User is not found')
        }
    })
})


app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('Unable to complete request'))
})
  

app.listen(3000, ()=> {
    console.log('app is running on 3000')
})

