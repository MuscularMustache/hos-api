const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } = graphql;
const mongoose = require('mongoose');
const UserType = require('./types/user_type');
const User = mongoose.model('user');
const ListType = require('./types/list_type');
const List = mongoose.model('list');
const ConsequenceType = require('./types/consequence_type');
const Consequence = mongoose.model('consequence');
const GameType = require('./types/game_type');
const Game = mongoose.model('game');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // this user is the currently logged in user
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return User.findById(id);
      }
    },
    authuser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, { id }) {
        return User.findOne({userID: id});
      }
    },
    lists: {
      type: new GraphQLList(ListType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        // return all lists that belong to a user - id is userId - prev: return List.find({}).where({ user: id });
        return List.find({user: id});
      }
    },
    list: {
      type: ListType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return List.findById(id);
      }
    },
    consequence: {
      type: ConsequenceType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return Consequence.findById(id);
      }
    },
    game: {
      type: new GraphQLList(GameType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        // i think i have to make this a GraphQLList because when i do find it filters results and has to be an array
        return Game.find({user: id});
      }
    }
  }
});

module.exports = RootQueryType;
