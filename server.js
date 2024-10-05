const express = require('express')
const cors = require("cors");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const schema = require("./graphql/schema.js")

const app = express()

// to avoid cors issues for server to server requests
app.use(cors());

app.get('/health/_ping', (req, res) => {
    res.status(200).json({message: 'The service is working.'})
})

app.use(
    "/graphql",
    expressGraphQL({
      schema: schema,
      graphiql: true,
    })
  );

app.listen(3000)