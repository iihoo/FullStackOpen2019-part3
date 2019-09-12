//const http = require('http')
const express = require('express')
const app = express()

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

const info = `<p>Phonebook has info for ${persons.length} people</p>
              <p>${new Date()}</p>`

app.get('/', (req, res) => {
  res.send('<h1>Hello Finland!</h1>')
})

app.get('/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(info)
})

app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})