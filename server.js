const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');



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
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    const user = database.users.find(user => user.id === id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json('No such user exists!');
    }
});


app.put('/image', (req, res) => {
    console.log(req.body);
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('User not found!');
    }
})
  

app.listen(3000, ()=> {
    console.log('app is running on 3000')
})

