const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = graphql;
const mongoose = require('mongoose');
const UserType = require('./types/user_type');
const AuthService = require('../services/auth');
const ListType = require('./types/list_type');
const List = mongoose.model('list');
const ConsequenceType = require('./types/consequence_type');
const Consequence = mongoose.model('consequence');

// since we can do a password confirmation on the frontend we don't need to send
//- a password and pw confirmation to the backend
// the return in the resolve is necessary because it responds with a promise so gql will wait until its resolved
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.signup({ email, password, req });
      }
    },
    logout: {
      type: UserType,
      // NOTE: since theres no args here we dont pass anything into the mutation
      resolve(parentValue, args, req) {
        // when we call req.logout it returns the user property off the request
        //- we need to return something from the resolve so we save the user in a const before
        //- logging out and sending it along
        const { user } = req;
        req.logout();
        return user;
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.login({ email, password, req });
      }
    },
    addList: {
      type: ListType,
      args: {
        title: { type: GraphQLString }
      },
      resolve(parentValue, { title }) {
        return (new List({ title })).save()
      }
    },
    addConsequenceToList: {
      type: ListType,
      args: {
        content: { type: GraphQLString },
        listId: { type: GraphQLID }
      },
      resolve(parentValue, { content, listId }) {
        return List.addConsequence(listId, content);
      }
    },
    deleteList: {
      type: ListType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return List.remove({ _id: id });
      }
    },
    toggleListPull: {
      type: ListType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return List.togglePull(id);
      }
    },
    deleteConsequence: {
      type: ConsequenceType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return Consequence.remove({ _id: id });
      }
    },
  }
});

// NOTE: the list type accepts boolean crieria that i'll have to update later
//- when i change user list access

// TODO: need to delete all consequences related to a list when deleteing a list

// TODO: add editing abilities

module.exports = mutation;
