const express = require('express')
const app = express()

app.get('/health/_ping', (req, res) => {
    res.status(200).json({message: 'The service is working.'})
})

app.listen(3000)