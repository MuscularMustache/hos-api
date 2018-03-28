const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean
} = graphql;
const ConsequenceType = require('./consequence_type');
const List = mongoose.model('list');

const ListType = new GraphQLObjectType({
  name:  'ListType',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    listType: { type: GraphQLString },
    pullForGame: {type: GraphQLBoolean },
    user: {
      type: require('./user_type'),
      resolve(parentValue) {
        // find user from models
        return List.findUser(parentValue.id);
      }
    },
    consequences: {
      type: new GraphQLList(ConsequenceType),
      resolve(parentValue) {
        return List.findConsequences(parentValue.id);
      }
    }
  })
});

module.exports = ListType;
