const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString
} = graphql;

const Consequence = mongoose.model('consequence');

const ConsequenceType = new GraphQLObjectType({
  name:  'ConsequenceType',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    list: {
      type: require('./list_type'),
      resolve(parentValue) {
        return Consequence.findById(parentValue).populate('list')
          .then(consequence => {
            return consequence.list
          });
      }
    }
  })
});

module.exports = ConsequenceType;
