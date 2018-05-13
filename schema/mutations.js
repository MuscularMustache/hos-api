const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} = graphql;
const mongoose = require('mongoose');
const UserType = require('./types/user_type');
const User = mongoose.model('user');
const AuthService = require('../services/auth');
const ListType = require('./types/list_type');
const List = mongoose.model('list');
const ConsequenceType = require('./types/consequence_type');
const Consequence = mongoose.model('consequence');

const GameType = require('./types/game_type');
const Game = mongoose.model('game');

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
        title: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, { title, userId }) {
        if (title === '') {
          throw 'List name cannot be blank!';
        }
        // find user and create a new list with the whole user and new list title
        return User.findById(userId).then(user => {
          return (new List({ title, user })).save();
        });
      }
    },
    addConsequenceToList: {
      type: ListType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        listId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, { content, listId }) {
        if (content === '') {
          throw 'Consequence cannot be blank!';
        }
        return List.addConsequence(listId, content);
      }
    },
    deleteList: {
      type: ListType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return List.removeListAndConsequences(id);
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
    startGame: {
      type: GameType,
      args: { userId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { userId }) {
        return Game.startGame(userId);
      }
    },
    deleteGame: {
      type: GameType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return Game.remove({ _id: id });
      }
    },
  }
});

module.exports = mutation;
