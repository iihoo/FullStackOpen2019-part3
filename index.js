const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Miika-Masa",
    "number": "7890",
    "id": 8
  },
  {
    "name": "Jami-Jaska",
    "number": "020202",
    "id": 9
  },
  {
    "name": "Jimmy",
    "number": "999-999",
    "id": 10
  },
  {
    "name": "Jummi Jammi",
    "number": "002",
    "id": 11
  },
  {
    "name": "Co Co Cola",
    "number": "90",
    "id": 14
  },
  {
    "name": "James B",
    "number": "9080808",
    "id": 15
  }
]

morgan.token('person', function getPerson(req) {
  return req.person
})

app.use(bodyParser.json())
app.use(assignPerson)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
//app.use(morgan('tiny'))
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Welcome to phonebook!</h1>')
})

app.get('/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(info)
})

app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  names = persons.map(person => person.name)
  //console.log(names)
  //console.log('body.name: ' + body.name)
  if (names.includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

function assignPerson(req, res, next) {
  const person = JSON.stringify(req.body) 
  if (person.length === 2){
    req.person = ""
  } else {
    req.person = person
  }
  next()
}

const info = `<p>Phonebook has info for ${persons.length} people</p>
              <p>${new Date()}</p>`

const generateId = () => {
  const generatedId = Math.round(100000 * Math.random())
  return generatedId
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})