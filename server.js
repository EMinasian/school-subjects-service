const express = require('express')
const getTeachers = require('./utils/getTeachers')

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

app.get('/health/_ping', (req, res) => {
    res.status(200).json({message: 'The service is working.'})
})

app.get('/teachers', (req, res) => {
    const teachers = getTeachers()
    res.status(200).json(teachers)
})

app.listen(3000)