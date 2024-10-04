const express = require('express')
const cors = require("cors");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const { getAllSubjects, getSubjectStudents } = require('./utils/subjects')
const { getAllTeachers } = require('./utils/teachers')


const StudentType = new GraphQLObjectType({
  name: 'Student',
  description: 'Represents a student',
  fields: () => ({
    firstname: { type: new GraphQLNonNull(GraphQLString) },
    lastname: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const SubjectType = new GraphQLObjectType({
  name: 'Subject',
  description: 'Represents a subject',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    class: { type: GraphQLString },
    teacherId: { type: new GraphQLNonNull(GraphQLInt) },
    students: { 
      type: new GraphQLList(StudentType),
      resolve: (subject) => {
        const students = getSubjectStudents(subject.id)
        return students
      }
    }
  })
})

const TeacherType = new GraphQLObjectType({
  name: 'Teacher',
  description: 'Represents a teacher',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    firstname: { type: new GraphQLNonNull(GraphQLString) },
    lastname: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
    room: { type: GraphQLString }
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
    },
    teachers: {
      type: new GraphQLList(TeacherType),
      description: "The list of teachers",
      resolve: () => {
        const teachers = getAllTeachers()
        return teachers
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})

const app = express()

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