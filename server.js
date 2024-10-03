const express = require('express')
const getTeachers = require('./utils/getTeachers')

const app = express()

app.get('/health/_ping', (req, res) => {
    res.status(200).json({message: 'The service is working.'})
})

app.get('/teachers', (req, res) => {
    const teachers = getTeachers()
    res.status(200).json(teachers)
})

app.listen(3000)