const express = require('express')
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const { getAllSubjects } = require('./utils/subjects')
const { getAllTeachers } = require('./utils/teachers')

const SubjectType = new GraphQLObjectType({
  name: 'Subject',
  description: 'Represents a subject',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    class: { type: GraphQLString },
    teacherId: { type: new GraphQLNonNull(GraphQLInt) }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: "The root query",
  fields: () => ({
    subjects: {
      type: new GraphQLList(SubjectType),
      description: "The list of subjects",
      resolve: () => {
        const subjects = getAllSubjects()
        return subjects
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });

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

  app.get('/teachers', (req, res) => {
    const teachers = getAllTeachers()
    res.status(200).json(teachers)
})

app.listen(3000)