const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://iihoo:${password}@cluster0-bmeq0.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
        process.exit(1)
    })
}

const newName = process.argv[3]
const newNumber = process.argv[4]
const generatedId = Math.round(100000 * Math.random())

const person = new Person({
    name: newName,
    number: newNumber,
    id: generatedId,
})

person.save().then(response => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
})
