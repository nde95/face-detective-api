const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');

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

const database = {
    users: [
        {
            id: '123',
            name: 'Jacob',
            email: 'Jacob@gmail.com',
            password: 'johnjacob',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Terry',
            email: 'Terry@gmail.com',
            password: 'terryjacob',
            entries: 0,
            joined: new Date()
        },
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
   if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json(database.users[0]);
   } else {
    res.status(400).json('error logging in');
   }
})


app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    db('users')
        .returning('*')
        .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
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

