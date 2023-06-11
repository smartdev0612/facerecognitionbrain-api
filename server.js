const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'pass123',
    database: 'postgres',
  },
})

const app = express()
app.use(express.json())
app.use(cors())

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
}

app.get('/', (req, res) => {
  res.status(200).json(database.users)
})

app.post('/signin', (req, res) => {
  bcrypt.compare(
    'apples',
    '$2a$10$C0LpC3umiT1wXgVxVAGVgOSH0b4Hmei9.QPtWc15b0iXed.1Ihj0q',
    function (err, res) {
      console.log('first guess', res)
    }
  )

  bcrypt.compare(
    'veggies',
    '$2a$10$C0LpC3umiT1wXgVxVAGVgOSH0b4Hmei9.QPtWc15b0iXed.1Ihj0q',
    function (err, res) {
      console.log('second guess', res)
    }
  )

  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0])
  } else {
    res.status(400).json('error logging in')
  }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0])
    })
    .catch((err) => res.status(400).json('unable to join'))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  db.select('*')
    .from('users')
    .where({
      id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch((err) => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0])
    })
    .catch((err) => res.status(400).json('unable to get entries'))
})

app.listen(3005, () => {
  console.log('app is running on port 3005')
})

/* API endpoints

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/
