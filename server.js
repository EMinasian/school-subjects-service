const express = require('express')
const cors = require("cors");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const bodyParser = require('body-parser');
const schema = require("./graphql/schema.js")
const { addUser, getUserByEmail } = require("./utils/users.js")
const { createJSONToken, isValidPassword } = require("./utils/auth.js")

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

app.post('/login', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await getUserByEmail(email);

  if (!user) {
    res.status(422).json({
      message: 'The user could not be found.',
      errors: { credentials: 'Invalid user.' },
    });
  }

  const isValid = await isValidPassword(password, user.hashedPassword);

  if (!isValid) {
    res.status(422).json({
      message: 'Invalid credentials.',
      errors: { credentials: 'Invalid password.' },
    });
  }

  const token = createJSONToken(email);
  res.json({ token });
});

app.listen(3000)