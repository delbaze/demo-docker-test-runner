import { gql, ApolloServer } from "apollo-server";

import datasource from "/app/server/src/lib/datasource";
import UserResolver from "/app/server/src/resolvers/User.resolver";
import { buildSchema } from "type-graphql";

// console.log(datasource);

beforeEach(async () => {
  await datasource.initialize();
  await datasource.dropDatabase();
  await datasource.synchronize();
});
afterEach(async () => {
  await datasource.destroy();
});
let apolloServer = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });
  return await new ApolloServer({
    schema,
    context: { user: { email: "demo@gmail.com" } },
  });
};



const LIST_USERS = gql`
  query ListUsers {
    listUsers {
      id
      name
      password
      email
    }
  }
`;
const LIST_USERS_TEST = gql`
  query ListUsers {
    listUsers {
      name
    }
  }
`;

const ADD_USER = gql`
  mutation CreateUser($createInput: CreateInput!) {
    createUser(createInput: $createInput) {
      email
      id
      name
      password
    }
  }
`;

describe("User Resolver", () => {
  it("Users are empty", async () => {
    let server = await apolloServer();
    server.start();

    let result = await server.executeOperation({
      query: LIST_USERS,
    });
    let users = result?.data?.listUsers;
    expect(users).toEqual([]);
  });

  it("Users contain new user", async () => {
    let server = await apolloServer();
    server.start();

    await server.executeOperation({
      query: ADD_USER,
      variables: {
        createInput: {
          email: "demo@gmail.com",
          name: "demo",
          password: "demo",
        },
      },
    });
    let result = await server.executeOperation({
      query: LIST_USERS_TEST,
    });
    let users = result?.data?.listUsers;
    expect(users).toEqual([{ __typename: "User", name: "demo" }]);
  });
});
