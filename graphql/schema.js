const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require("graphql");
const { getAllSubjects, getSubjectStudents, getSubjectTeacher, deleteEnrollment, getSubjectById } = require('../utils/subjects')
const { getAllTeachers } = require('../utils/teachers')


const StudentType = new GraphQLObjectType({
    name: 'Student',
    description: 'Represents a student',
    fields: () => ({
      id: { type: GraphQLInt },
      firstname: { type: new GraphQLNonNull(GraphQLString) },
      lastname: { type: new GraphQLNonNull(GraphQLString) }
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

const SubjectType = new GraphQLObjectType({
    name: 'Subject',
    description: 'Represents a subject',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLInt) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      class: { type: GraphQLString },
      teacher: { 
        type: TeacherType,
        resolve: (subject) => {
          const teacher = getSubjectTeacher(subject.id)
          return teacher
        } 
      },
      students: { 
        type: new GraphQLList(StudentType),
        resolve: (subject) => {
          return getSubjectStudents(subject.id)
        }
      }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: "The root query",
    fields: () => ({
      subjects: {
        type: new GraphQLList(SubjectType),
        description: "The list of subjects",
        args: { 
          subjectId: { type: GraphQLInt } 
        },
        resolve: (parent, args) => {
          const { subjectId } = args
          if (subjectId) {
            return getSubjectById(subjectId)
          }
          return getAllSubjects()
        }
      },
      teachers: {
        type: new GraphQLList(TeacherType),
        description: "The list of teachers",
        resolve: () => {
          return getAllTeachers()
        }
      }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation',
    fields: {
      deleteEnrollment: {
        type: new GraphQLList(StudentType),
        description: 'Remove enrollment',
        args: {
          subjectId: { type: new GraphQLNonNull(GraphQLInt) },
          studentId: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve: (parent, args) => {
          const { subjectId, studentId } = args;
          deleteEnrollment(subjectId, studentId);
          return getSubjectStudents(subjectId);
        }
      }
    }
  });

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

module.exports = schema