const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: GraphQLID },
    userID: { type: GraphQLString },
    theme: { type: GraphQLString },
    premiumMember: { type: GraphQLBoolean }
  }
});

module.exports = UserType;
