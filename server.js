const express = require('express')
const cors = require("cors");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const bodyParser = require('body-parser');
const schema = require("./graphql/schema.js")
const { addUser } = require("./utils/users.js")
const { createJSONToken } = require("./utils/auth.js")

const app = express()

// to avoid cors issues for server to server requests
app.use(cors());

app.use(bodyParser.json());

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

app.post('/signup', async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      await addUser(email, password);
      const authToken = createJSONToken(email);

      res.status(201).json({ message: 'User created.', user: createdUser, token: authToken });
    } catch (error) {
      next(error);
    }
});

app.listen(3000)