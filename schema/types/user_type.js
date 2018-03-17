const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

// not including password because this data could be exposed and we never want our passwords exposed
// note that if email would never be used or shared we wouldn't really need it here either
const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString }
  }
});

module.exports = UserType;
