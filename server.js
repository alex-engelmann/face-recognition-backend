const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}


app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // Load hash from your password DB.
    // bcrypt.compare('apples', '$2b$10$8G8wMD7GWy9DMFadJGdoV.TQCMjk3JhbdaKdWCzJDpH2u7Vz1QKIS', function (err, res) {
    //     // res == true
    //     console.log('first guess', res)
    // });
    // bcrypt.compare('veggies', '$2b$10$8G8wMD7GWy9DMFadJGdoV.TQCMjk3JhbdaKdWCzJDpH2u7Vz1QKIS', function (err, res) {
    //     // res == false
    //     console.log('second guess', res)
    // });


    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }

})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        console.log(hash);
    });

    database.users.push({
        id: '125',
        name: name,
        email: email,
        // password: password, removed for security
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(404).json('no such user')
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json('no such user')
    }
})






app.listen(3000, () => {
    console.log('app is running on port 3000')
})
