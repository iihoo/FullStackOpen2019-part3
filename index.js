require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

let persons = [
  //{
  //  "name": "Arto Hellas",
  //  "number": "040-123456",
  //  "id": 1
  //},
  //{
  //  "name": "Ada Lovelace",
  //  "number": "39-44-5323523",
  //  "id": 2
  //},
  //{
  //  "name": "Dan Abramov",
  //  "number": "12-43-234345",
  //  "id": 3
  //},
  //{
  //  "name": "Miika-Masa",
  //  "number": "7890",
  //  "id": 8
  //},
  //{
  //  "name": "Jami-Jaska",
  //  "number": "020202",
  //  "id": 9
  //},
  //{
  //  "name": "Jimmy",
  //  "number": "999-999",
  //  "id": 10
  //},
  //{
  //  "name": "Jummi Jammi",
  //  "number": "002",
  //  "id": 11
  //},
  //{
  //  "name": "Co Co Cola",
  //  "number": "90",
  //  "id": 14
  //},
  //{
  //  "name": "James B",
  //  "number": "9080808",
  //  "id": 15
  //}
]

morgan.token('person', function getPerson(req) {
  return req.person
})

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(assignPerson)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
//app.use(morgan('tiny'))
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Welcome to phonebook!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    res.send(`<p>Phonebook has info for ${count} people</p>
              <p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name.length === 0) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// virheellisten pyyntöjen käsittely
app.use(errorHandler)

function assignPerson(req, res, next) {
  const person = JSON.stringify(req.body)
  if (person.length === 2) {
    req.person = ""
  } else {
    req.person = person
  }
  next()
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})