const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')

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
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash)
  })
  database.users.push({
    id: '125',
    name,
    email,
    entries: 0,
    joined: new Date(),
  })
  res.status(201).json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  let found = false
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true
      return res.status(200).json(user)
    }
  })
  if (!found) res.status(400).json('Not found')
})

app.put('/image', (req, res) => {
  const { id } = req.body
  let found = false
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true
      user.entries++
      return res.json(user.entries)
    }
  })
  if (!found) res.status(400).json('Not found')
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
